<?php

namespace App\Http\Controllers\Librarian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Author;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AuthorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');

        $query = Author::query();

        if ($search) {
            $query->where('full_name', 'like', '%' . $search . '%');
        }

        $authors = $query->paginate($perPage)->withQueryString();

        return Inertia::render('librarian/sections/books/author', [
            'authors' => $authors,
            'filters' => compact('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255|unique:authors,full_name',
            'biography' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['full_name', 'biography']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('authors', 'public');
            $data['image'] = $imagePath;
        }

        $author = Author::create($data);

        return redirect()->back()->with('success', 'Autor creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $author = Author::findOrFail($id);
        
        return response()->json($author);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $author = Author::findOrFail($id);

        $request->validate([
            'full_name' => 'required|string|max:255|unique:authors,full_name,' . $id,
            'biography' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['full_name', 'biography']);

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($author->image) {
                Storage::disk('public')->delete($author->image);
            }
            
            $imagePath = $request->file('image')->store('authors', 'public');
            $data['image'] = $imagePath;
        }

        $author->update($data);

        return redirect()->back()->with('success', 'Autor actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $author = Author::findOrFail($id);

        // Verificar si el autor tiene libros asociados
        if ($author->books()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar el autor porque tiene libros asociados.');
        }

        // Eliminar imagen si existe
        if ($author->image) {
            Storage::disk('public')->delete($author->image);
        }

        $author->delete();

        return redirect()->back()->with('success', 'Autor eliminado exitosamente.');
    }
}
