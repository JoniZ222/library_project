<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Obtener una cita inspiradora aleatoria y separar el mensaje del autor
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            // Nombre de la aplicación desde la configuración
            'name' => config('app.name'),
            // Cita inspiradora con mensaje y autor
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            // Datos de autenticación del usuario actual
            'auth' => [
                'user' => $request->user(),
            ],
            // Configuración de Ziggy para rutas con la ubicación actual
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // Estado del sidebar basado en cookies (abierto por defecto si no hay cookie)
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            // URL base para archivos de almacenamiento
            'storageUrl' => asset('storage'),
        ];

        // Mensajes flash de sesión para diferentes tipos de alertas
        return [
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
            'warning' => $request->session()->get('warning'),
            'info' => $request->session()->get('info'),
            'danger' => $request->session()->get('danger'),
        ];
    }
}
