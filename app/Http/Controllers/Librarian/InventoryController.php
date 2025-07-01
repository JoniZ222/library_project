<?php

namespace App\Http\Controllers\Librarian;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');

        $query = Inventory::with('book');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('quantity', 'like', "%{$search}%")
                    ->orWhere('condition', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('book', function ($bookQuery) use ($search) {
                        $bookQuery->where('title', 'like', "%{$search}%")
                            ->orWhere('isbn', 'like', "%{$search}%");
                    });
            });
        }

        $inventory = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return Inertia::render('librarian/sections/books/inventory', [
            'inventory' => $inventory,
            'filters' => [
                'perPage' => $perPage,
                'search' => $search,
            ]
        ]);
    }

    public function update(Request $request, string $id)
    {
        $inventory = Inventory::findOrFail($id);

        $request->validate([
            'quantity' => 'required|integer|min:0',
            'condition' => 'required|string|in:nuevo,usado,deteriorado',
            'location' => 'required|string|max:255',
            'status' => 'nullable|string|in:disponible,prestado,reservado,perdido,danado',
            'notes' => 'nullable|string|max:1000',
        ]);

        $inventory->update($request->only(['quantity', 'condition', 'location', 'status', 'notes']));

        return redirect()->back()->with('success', 'Inventario actualizado correctamente');
    }

    public function show(string $id)
    {
        $inventory = Inventory::findOrFail($id);
        return response()->json($inventory);
    }
}
