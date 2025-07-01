<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ManagementUsers extends Controller
{
    public function create_admin(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');

        $query = User::query();
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/sections/admin', [
            'users' => $users,
            'filters' => compact('search', 'perPage'),
        ]);
    }

    public function store_admin(Request $request)
    {
        $token = Str::random(32);
        $validated = $request->validate([
            'matricula' => 'required|string|max:255',
        ]);

        $user = User::create(array_merge($validated, ['role' => 'admin', 'activation_token' => $token, 'status' => false]));

        return redirect()->route('admin.users')->with('success', 'Usuario creado satisfactoriamente');
    }

    public function edit_admin(User $user)
    {
        return Inertia::render('admin/sections/admin/edit', [
            'user' => $user
        ]);
    }


    public function update_admin(User $user, Request $request)
    {
        $validated = $request->validate([
            'matricula' => 'required|string|max:255',
        ]);

        $user->update($validated);

        return redirect()->route('admin.users')->with('success', 'Usuario actualizado satisfactoriamente');
    }

    public function destroy_admin(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users')->with('success', 'Usuario eliminado satisfactoriamente');
    }

    public function create_librarian(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');

        $query = User::where('role', 'librarian');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $librarians = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/sections/librarian', [
            'librarians' => $librarians,
            'filters' => compact('search', 'perPage'),
        ]);
    }

    public function store_librarian(Request $request)
    {
        $token = Str::random(32);
        $validated = $request->validate([
            'matricula' => 'required|string|max:255',
        ]);

        $user = User::create(array_merge($validated, ['role' => 'librarian', 'activation_token' => $token, 'status' => false]));

        return redirect()->route('admin.librarians')->with('success', 'Bibliotecario creado satisfactoriamente');
    }

    public function edit_librarian(User $user)
    {
        return Inertia::render('admin/sections/librarian/edit', [
            'user' => $user
        ]);
    }

    public function update_librarian(User $user, Request $request)
    {
        $validated = $request->validate([
            'matricula' => 'required|string|max:255',
        ]);

        $user->update($validated);

        return redirect()->route('admin.librarians')->with('success', 'Bibliotecario actualizado satisfactoriamente');
    }

    public function destroy_librarian(User $user)
    {
        $user->delete();
        return redirect()->route('admin.librarians')->with('success', 'Bibliotecario eliminado satisfactoriamente');
    }
}
