<?php

namespace App\Http\Controllers\Librarian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Publisher;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PublishersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');

        $query = Publisher::query();

        // Filtrar por nombre
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $publishers = $query->paginate($perPage)->withQueryString();

        return Inertia::render('librarian/sections/books/publisher', [
            'publishers' => $publishers,
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
    /**
     * Almacena una nueva editorial en la base de datos.
     * 
     * @param Request $request La solicitud HTTP con los datos de la editorial
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $request->validate([
            'name' => 'required|string|max:255|unique:publishers,name',        // Nombre obligatorio
            'address' => 'nullable|string|max:255',     // Dirección opcional
            'phone' => 'nullable|string|max:255',       // Teléfono opcional
            'email' => 'nullable|email|max:255',        // Email opcional con formato válido
            'website' => 'nullable|string|max:255',     // Sitio web opcional
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Imagen opcional
        ]);

        $data = $request->only(['name', 'address', 'phone', 'email', 'website']);

        // Procesar imagen si se proporciona
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('publishers', 'public');
            $data['image'] = $imagePath;
        }

        // Crear la editorial en la base de datos
        $publisher = Publisher::create($data);

        // Redirigir con mensaje de éxito
        return redirect()->back()->with('success', 'Editorial creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $publisher = Publisher::findOrFail($id);
        return response()->json($publisher);
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
        $publisher = Publisher::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:publishers,name,' . $id,
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        $data = $request->only(['name', 'address', 'phone', 'email', 'website']);

        if ($request->hasFile('image')) {
            if ($publisher->image) {
                Storage::disk('public')->delete($publisher->image);
            }

            $imagePath = $request->file('image')->store('publishers', 'public');
            $data['image'] = $imagePath;
        }

        $publisher->update($data);

        return redirect()->back()->with('success', 'Editorial actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $publisher = Publisher::findOrFail($id);

        if ($publisher->books()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar la editorial porque tiene libros asociados.');
        }

        if ($publisher->image) {
            Storage::disk('public')->delete($publisher->image);
        }

        $publisher->delete();

        return redirect()->back()->with('success', 'Editorial eliminada exitosamente.');
    }
}
