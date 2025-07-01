<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class ActivateAccountController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/matricula-form');
    }

    public function processMatricula(Request $request)
    {
        $request->validate([
            'matricula' => 'required|string',
        ]);

        $user = User::where('matricula', $request->matricula)->first();


        if (!$user) {                       
            return back()->withErrors(['matricula' => 'Matrícula no encontrada.']);
        }

        if($user->status) {
            return back()->with('status', 'La cuenta ya está activada.');
        }

        return redirect()->route('activation.form', ['token' => $user->activation_token]);
    }


    public function showActivationForm($token)
    {
        $user = User::where('activation_token', $token)->first();

        if (!$user) {
            abort(404, 'Token de activación inválido.');
        }

        if($user->status) {
            return redirect()->route('login')->with('status', 'La cuenta ya está activada.');
        }

        return Inertia::render('auth/activation-form', [
            'matricula' => $user->matricula,
            'token' => $token
        ]);
    }

    public function activate(Request $request, $token)
    {
        $user = User::where('activation_token', $token)->first();

        if (!$user) {
            abort(404, 'Token de activación inválido.');
        }

        if($user->status) {
            return redirect()->route('login')->with('status', 'La cuenta ya está activada.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'status' => true,
            'activation_token' => null,
        ]);

        Auth::login($user);

        switch($user->role) {
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'librarian':
                return redirect()->route('librarian.dashboard');
            case 'student':
                return redirect()->route('home');
        }
    }
}
