<?php

namespace App\Http\Controllers\Librarian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genre;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GenresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);

        $query = Genre::query();

        if ($request->has('search')) {
            $query->where('name', 'like', "%$search%");
        }

        $genres = $query->paginate($perPage);

        return Inertia::render('librarian/sections/books/genre', [
            'genres' => $genres,
            'filters' => compact('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:genres,name',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('genres', 'public');
            $data['image'] = $imagePath;
        }

        $genre = Genre::create($data);

        return redirect()->back()->with('success', 'Género creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $genre = Genre::findOrFail($id);
        return response()->json($genre);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $genre = Genre::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:genres,name,' . $id,
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            if ($genre->image) {
                Storage::disk('public')->delete($genre->image);
            }
            $imagePath = $request->file('image')->store('genres', 'public');
            $data['image'] = $imagePath;
        }

        $genre->update($data);

        return redirect()->back()->with('success', 'Género actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $genre = Genre::findOrFail($id);

        if ($genre->books()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar el género porque tiene libros asociados.');
        }

        if ($genre->image) {
            Storage::disk('public')->delete($genre->image);
        }

        $genre->delete();

        return redirect()->back()->with('success', 'Género eliminado exitosamente');
    }
}
