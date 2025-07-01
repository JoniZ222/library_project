<?php

namespace App\Http\Controllers\Librarian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Genre;
use App\Models\Author;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class QuickCreateController extends Controller
{
    public function createCategory(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar permisos
        $user = Auth::user();
        if ($user->role !== 'librarian' && $user->role !== 'admin') {
            return response()->json(['error' => 'Sin permisos'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        try {
            $category = Category::create([
                'name' => $request->name,
            ]);

            Log::info('Categoría creada rápidamente:', [
                'id' => $category->id,
                'name' => $category->name,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'id' => $category->id,
                'name' => $category->name,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al crear categoría:', [
                'name' => $request->name,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Error al crear la categoría'], 500);
        }
    }

    public function createPublisher(Request $request): JsonResponse
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar permisos
        $user = Auth::user();
        if ($user->role !== 'librarian' && $user->role !== 'admin') {
            return response()->json(['error' => 'Sin permisos'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:publishers,name',
        ]);

        try {
            $publisher = Publisher::create([
                'name' => $request->name,
            ]);

            Log::info('Editorial creada rápidamente:', [
                'id' => $publisher->id,
                'name' => $publisher->name,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'id' => $publisher->id,
                'name' => $publisher->name,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al crear editorial:', [
                'name' => $request->name,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Error al crear la editorial'], 500);
        }
    }

    public function createGenre(Request $request): JsonResponse
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar permisos
        $user = Auth::user();
        if ($user->role !== 'librarian' && $user->role !== 'admin') {
            return response()->json(['error' => 'Sin permisos'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:genres,name',
        ]);

        try {
            $genre = Genre::create([
                'name' => $request->name,
            ]);

            Log::info('Género creado rápidamente:', [
                'id' => $genre->id,
                'name' => $genre->name,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'id' => $genre->id,
                'name' => $genre->name,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al crear género:', [
                'name' => $request->name,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Error al crear el género'], 500);
        }
    }

    public function createAuthor(Request $request): JsonResponse
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar permisos
        $user = Auth::user();
        if ($user->role !== 'librarian' && $user->role !== 'admin') {
            return response()->json(['error' => 'Sin permisos'], 403);
        }

        $request->validate([
            'full_name' => 'required|string|max:255|unique:authors,full_name',
        ]);

        try {
            $author = Author::create([
                'full_name' => $request->full_name,
            ]);

            Log::info('Autor creado rápidamente:', [
                'id' => $author->id,
                'full_name' => $author->full_name,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'id' => $author->id,
                'name' => $author->full_name, // Usamos 'name' para mantener consistencia
            ]);
        } catch (\Exception $e) {
            Log::error('Error al crear autor:', [
                'full_name' => $request->full_name,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Error al crear el autor'], 500);
        }
    }
}
