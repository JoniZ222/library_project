<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class LoginService
{
    public function handle(Request $request)
    {
        $this->handleRedirectUrl($request);

        $request->authenticate();
        $request->session()->regenerate();

        return $this->redirectByRole();
    }

    protected function handleRedirectUrl(Request $request): void
    {
        if ($redirect = $request->input('redirect')) {
            $path = parse_url($redirect, PHP_URL_PATH);

            if (Str::startsWith($path, '/')) {
                $request->session()->put('url.intended', $path);
            }
        }
    }

    protected function redirectByRole(): \Illuminate\Http\RedirectResponse
    {
        return match (Auth::user()->role) {
            'reader_public' => redirect()->intended(route('public.catalog', absolute: false)),
            'admin'         => redirect()->intended(route('admin.dashboard', absolute: false)),
            'librarian'     => redirect()->intended(route('librarian.dashboard', absolute: false)),
            default         => redirect()->intended(route('home', absolute: false)),
        };
    }
}
