<?php

namespace App\Http\Controllers\Librarian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Book;
use App\Models\Author;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Genre;
use App\Services\ImageService;
use Illuminate\Support\Facades\Auth;
use App\Traits\Pagination\HandlePagination;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Requests\BookRequest;

class BooksController extends Controller
{
    use HandlePagination;

    protected $imageService;
    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    private function checkLibrarianPermissions()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        if ($user->role !== 'librarian' && $user->role !== 'admin') {
            return redirect()->back()->with('error', 'No tienes permisos para realizar esta acción.');
        }

        return null;
    }

    private function processCoverImage($request, $oldCoverImage = null)
    {
        if (!$request->hasFile('cover_image')) {
            return $oldCoverImage;
        }

        $coverFile = $request->file('cover_image');

        if (!$this->imageService->validateImage($coverFile)) {
            throw new \Exception('La imagen de portada no es válida.');
        }

        $coverImagePath = $this->imageService->compressImage($coverFile, 90, 1920, 1080);

        if ($oldCoverImage) {
            Storage::disk('public')->delete($oldCoverImage);
        }

        return $coverImagePath;
    }

    private function handleAuthors(Book $book, ?array $authors)
    {
        if (is_array($authors)) {
            $authors = array_filter($authors);
            if (!empty($authors)) {
                $book->authors()->sync($authors);
            }
        }
    }

    private function handleBookDetails(Book $book, ?array $details)
    {
        $details = array_filter((array)$details, function ($value) {
            return $value !== null && $value !== '';
        });

        if (empty($details)) {
            return;
        }

        if ($book->bookDetails) {
            $book->bookDetails->update($details);
        } else {
            $book->bookDetails()->create($details);
        }
    }

    private function handleInventory(Book $book, ?array $inventory)
    {
        $inventory = array_filter((array)$inventory, function ($value) {
            return $value !== null && $value !== '';
        });

        if (empty($inventory)) {
            return;
        }

        if ($book->inventory) {
            $book->inventory->update($inventory);
        } else {
            $book->inventory()->create($inventory);
        }
    }

    private function getSharedFormData()
    {
        return [
            'authors' => Author::all(),
            'categories' => Category::all(),
            'publishers' => Publisher::all(),
            'genres' => Genre::all(),
            'storageUrl' => asset('storage'),
        ];
    }

    public function index(Request $request)
    {
        ['perPage' => $perPage] = $this->getPaginationParams($request);

        $books = QueryBuilder::for(Book::query()->with(Book::BOOK_RELATIONS))
            ->allowedFilters([
                AllowedFilter::partial('title'),
                AllowedFilter::partial('isbn'),
                AllowedFilter::callback('author', function ($query, $value) {
                    $query->whereHas('authors', fn($q) => $q->where('name', 'like', "%$value%"));
                }),
            ])
            ->defaultSort('-created_at')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('librarian/sections/books/books', $this->buildPaginationResponse(
            $books,
            [
                'title' => $request->input('filter.title'),
                'isbn' => $request->input('filter.isbn'),
                'author' => $request->input('filter.author'),
                'perPage' => $perPage,
            ],
            [],
            'books',
        ));
    }

    public function create()
    {
        return Inertia::render('librarian/sections/create-book', $this->getSharedFormData());
    }

    public function store(BookRequest $request)
    {
        if ($errorResponse = $this->checkLibrarianPermissions()) {
            return $errorResponse;
        }

        DB::beginTransaction();

        try {
            $coverImagePath = $this->processCoverImage($request);

            $bookData = $this->prepareBookData($request, $coverImagePath);
            $book = Book::create($bookData);

            $this->handleAuthors($book, $request->authors);
            $this->handleBookDetails($book, $request->book_details);
            $this->handleInventory($book, $request->inventory);

            $this->imageService->cleanupTempFiles();
            DB::commit();

            return redirect()->route('librarian.books.list')
                ->with('success', 'Libro creado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->cleanupOnError($coverImagePath ?? null);

            return redirect()->back()
                ->with('error', 'Error al crear el libro: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function edit($id)
    {
        try {
            $book = Book::with(['publisher', 'genre', 'bookDetails', 'inventory', 'category', 'authors'])
                ->findOrFail($id);

            return Inertia::render('librarian/sections/books/edit', array_merge(
                ['book' => $book],
                $this->getSharedFormData()
            ));
        } catch (\Exception $e) {
            return redirect()->route('librarian.books.list')
                ->with('error', 'No se pudo cargar el libro para edición.');
        }
    }

    public function update(BookRequest $request, $id)
    {
        if ($errorResponse = $this->checkLibrarianPermissions()) {
            return $errorResponse;
        }

        DB::beginTransaction();

        try {
            $book = Book::findOrFail($id);
            $oldCoverImage = $book->cover_image;

            $coverImagePath = $this->processCoverImage($request, $oldCoverImage);

            $bookData = $this->prepareBookData($request, $coverImagePath);
            $book->update($bookData);

            $this->handleAuthors($book, $request->authors);
            $this->handleBookDetails($book, $request->book_details);
            $this->handleInventory($book, $request->inventory);

            $this->imageService->cleanupTempFiles();
            DB::commit();

            return redirect()->route('librarian.books.list')
                ->with('success', 'Libro actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->cleanupOnError($coverImagePath ?? null, $oldCoverImage ?? null);

            return redirect()->back()
                ->with('error', 'Error al actualizar el libro: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy($id)
    {
        if ($errorResponse = $this->checkLibrarianPermissions()) {
            return $errorResponse;
        }

        try {
            $book = Book::findOrFail($id);
            $this->deleteBookRelations($book);
            $book->delete();

            return redirect()->route('librarian.books.list')
                ->with('success', 'Libro eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al eliminar el libro: ' . $e->getMessage());
        }
    }

    private function prepareBookData($request, $coverImagePath)
    {
        $bookData = [
            'title'        => $request->title,
            'isbn'         => $request->isbn,
            'folio'        => $request->folio,
            'description'  => $request->description,
            'category_id'  => $request->category_id ? (int)$request->category_id : null,
            'publisher_id'  => $request->publisher_id ? (int)$request->publisher_id : null,
            'genre_id'     => $request->genre_id ? (int)$request->genre_id : null,
            'cover_image'  => $coverImagePath,
        ];

        if ($request->filled('publication_year')) {
            $bookData['publication_year'] = (int)$request->publication_year;
        }

        return $bookData;
    }

    private function deleteBookRelations(Book $book)
    {
        if ($book->cover_image) {
            Storage::disk('public')->delete($book->cover_image);
        }

        optional($book->inventory)->delete();
        optional($book->bookDetails)->delete();

        if ($book->authors->isNotEmpty()) {
            $book->authors()->detach();
        }
    }

    private function cleanupOnError($newImagePath, $oldImagePath = null)
    {
        if ($newImagePath && $newImagePath !== $oldImagePath) {
            Storage::disk('public')->delete($newImagePath);
        }
    }
}
