<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Publisher;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with(['category', 'genre', 'publisher', 'authors'])
            ->where('is_active', true);

        if ($request->filled('availability')) {
            switch ($request->get('availability')) {
                case 'available':
                    $query->available();
                    break;
                case 'reserved':
                    $query->whereHas('reservations', function ($q) {
                        $q->whereIn('status', ['pending', 'approved']);
                    });
                    break;
                case 'borrowed':
                    $query->whereHas('loans', function ($q) {
                        $q->where('status', 'active');
                    });
                    break;
            }
        }


        // Paginación
        $perPage = $request->get('per_page', 12);
        $books = $query->paginate($perPage);

        // Agregar información de disponibilidad a cada libro
        $books->getCollection()->transform(function ($book) {
            $book->is_available = $book->isAvailable();
            $book->availability_status = $this->getAvailabilityStatus($book);
            $book->can_reserve = $this->canUserReserve($book);
            return $book;
        });

        // Datos para filtros
        $categories = Category::orderBy('name')->get();
        $genres = Genre::orderBy('name')->get();
        $publishers = Publisher::orderBy('name')->get();

        // Estadísticas
        $stats = [
            'total_books' => Book::where('is_active', true)->count(),
            'available_books' => Book::where('is_active', true)->available()->count(),
            'reserved_books' => Book::where('is_active', true)->whereHas('reservations', function ($q) {
                $q->whereIn('status', ['pending', 'approved']);
            })->count(),
            'borrowed_books' => Book::where('is_active', true)->whereHas('loans', function ($q) {
                $q->where('status', 'active');
            })->count(),
            'total_categories' => $categories->count(),
            'total_genres' => $genres->count(),
            'recent_books' => Book::where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
        ];

        return Inertia::render('catalog', [
            'books' => $books,
            'categories' => $categories,
            'genres' => $genres,
            'publishers' => $publishers,
            'stats' => $stats,
            'per_page' => $perPage,
            'user' => Auth::user() ? [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
                'role' => Auth::user()->role,
            ] : null
        ]);
    }

    public function show(Book $book)
    {
        $book->load(['category', 'genre', 'publisher', 'authors']);

        // Agregar información de disponibilidad
        $book->is_available = $book->isAvailable();
        $book->availability_status = $this->getAvailabilityStatus($book);
        $book->can_reserve = $this->canUserReserve($book);

        // Libros relacionados - CORREGIR LA CONSULTA
        $relatedBooks = Book::with(['category', 'genre', 'authors'])
            ->where('is_active', true)
            ->where('books.id', '!=', $book->id) // ← ESPECIFICAR LA TABLA
            ->where(function ($query) use ($book) {
                $query->where('books.category_id', $book->category_id)
                    ->orWhere('books.genre_id', $book->genre_id)
                    ->orWhereHas('authors', function ($authorQuery) use ($book) {
                        $authorQuery->whereIn('authors.id', $book->authors->pluck('id')); // ← ESPECIFICAR LA TABLA
                    });
            })
            ->limit(12)
            ->get();

        // Libros populares (por número de reservas)
        $popularBooks = Book::with(['category', 'genre', 'authors'])
            ->where('is_active', true)
            ->where('books.id', '!=', $book->id) // ← ESPECIFICAR LA TABLA
            ->withCount('reservations')
            ->orderBy('reservations_count', 'desc')
            ->limit(6)
            ->get();

        // Libros recientes
        $recentBooks = Book::with(['category', 'genre', 'authors'])
            ->where('is_active', true)
            ->where('books.id', '!=', $book->id) // ← ESPECIFICAR LA TABLA
            ->orderBy('books.created_at', 'desc') // ← ESPECIFICAR LA TABLA
            ->limit(6)
            ->get();

        // Agregar información de disponibilidad a todos los libros
        $relatedBooks->transform(function ($relatedBook) {
            $relatedBook->is_available = $relatedBook->isAvailable();
            return $relatedBook;
        });

        $popularBooks->transform(function ($popularBook) {
            $popularBook->is_available = $popularBook->isAvailable();
            return $popularBook;
        });

        $recentBooks->transform(function ($recentBook) {
            $recentBook->is_available = $recentBook->isAvailable();
            return $recentBook;
        });

        return Inertia::render('catalog/show', [
            'book' => $book,
            'relatedBooks' => $relatedBooks,
            'user' => Auth::user() ? [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
                'role' => Auth::user()->role,
            ] : null
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = $request->get('q');

        $books = Book::with('authors')
            ->where('title', 'like', "%{$query}%")
            ->orWhereHas('authors', function ($authorQuery) use ($query) {
                $authorQuery->where('full_name', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'authors' => $book->authors->pluck('full_name')->implode(', '),
                ];
            });

        return response()->json($books);
    }


    public function search(Request $request)
    {
        $q = $request->get('q');

        // Buscar los libros más similares (título o autor), incluir relaciones y pagina
        $books = Book::with(['authors', 'category', 'genre', 'publisher', 'inventory'])
            ->searchable($q)
            ->paginate(12);

        $books->getCollection()->transform(function ($book) {
            $book->is_available = $book->isAvailable();
            $book->availability_status = $this->getAvailabilityStatus($book);
            $book->can_reserve = $this->canUserReserve($book);
            return $book;
        });

        return Inertia::render('catalog/search', [
            'books' => $books,
            'categories' => Category::orderBy('name')->get(),
            'genres' => Genre::orderBy('name')->get(),
            'publishers' => Publisher::orderBy('name')->get(),
        ]);
    }


    /**
     * Obtener el estado de disponibilidad de un libro
     */
    private function getAvailabilityStatus($book)
    {
        if (!$book->is_active) {
            return 'inactive';
        }

        if ($book->loans()->active()->exists()) {
            $loan = $book->getActiveLoan();
            return [
                'status' => 'borrowed',
                'due_date' => $loan->due_date->format('d/m/Y'),
                'is_overdue' => $loan->isOverdue(),
            ];
        }

        if ($book->reservations()->active()->exists()) {
            $reservation = $book->getActiveReservation();
            return [
                'status' => 'reserved',
                'reserved_by' => $reservation->user->name,
                'reserved_at' => $reservation->reserved_at->format('d/m/Y'),
            ];
        }

        return [
            'status' => 'available',
            'message' => 'Disponible para préstamo'
        ];
    }

    /**
     * Verificar si el usuario puede reservar el libro
     */
    private function canUserReserve($book)
    {
        if (!Auth::check()) {
            return false;
        }

        if (!$book->isAvailable()) {
            return false;
        }

        // Verificar si el usuario ya tiene una reserva activa para este libro
        $existingReservation = Reservation::where('user_id', Auth::id())
            ->where('book_id', $book->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        return !$existingReservation;
    }
}
