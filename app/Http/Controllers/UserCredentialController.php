<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserCredentialController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        return Inertia::render('profile/credential', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'has_credential' => $user->hasCredential(),
                'is_verified' => $user->isCredentialVerified(),
                'credential_url' => $user->credential_url,
                'credential_verified_at' => $user->credential_verified_at,
                'verified_by' => $user->verifiedBy?->name,
            ]
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'credential' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = Auth::user();

        if ($user->hasCredential()) {
            Storage::disk('public')->delete($user->school_credential_path);
        }

        $path = $request->file('credential')->store('credentials', 'public');

        $user->update([
            'school_credential_path' => $path,
            'credential_verified_at' => null,
            'verified_by' => null,
        ]);

        return back()->with('success', 'Credencial subida exitosamente. Espera la verificación del bibliotecario.');
    }

    public function destroy()
    {
        $user = Auth::user();

        if ($user->hasCredential()) {
            Storage::disk('public')->delete($user->school_credential_path);

            $user->update([
                'school_credential_path' => null,
                'credential_verified_at' => null,
                'verified_by' => null,
            ]);

            return back()->with('success', 'Credencial eliminada exitosamente.');
        }

        return back()->withErrors(['credential' => 'No tienes una credencial subida.']);
    }

    public function verify(Request $request, User $user)
    {
        if (!Auth::user()->isLibrarian() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $user->update([
            'credential_verified_at' => now(),
            'verified_by' => Auth::id(),
        ]);

        return back()->with('success', 'Credencial verificada exitosamente.');
    }

    public function reject(Request $request, User $user)
    {
        if (!Auth::user()->isLibrarian() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $user->update([
            'credential_verified_at' => null,
            'verified_by' => null,
        ]);

        return back()->with('success', 'Credencial rechazada. El usuario deberá subir una nueva.');
    }
}
