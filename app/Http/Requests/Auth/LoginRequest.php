<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    /**
     * Determina si el usuario está autorizado a realizar esta solicitud
     * 
     * @return bool True si el usuario está autorizado, false en caso contrario
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    /**
     * Define las reglas de validación para los campos del formulario de login
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string> Reglas de validación
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Define los mensajes de error para las reglas de validación
     * 
     * @return array<string, string> Mapeo de campos a mensajes de error
     */
    public function messages(): array
    {
        return [
            'email.required' => 'El correo electrónico es requerido',
            'email.email' => 'El correo electrónico no es válido',
            'password.required' => 'La contraseña es requerida',
        ];
    }
    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    /**
     * Intenta autenticar al usuario con las credenciales proporcionadas
     * 
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        // Verifica que no se haya excedido el límite de intentos de login
        $this->ensureIsNotRateLimited();

        // Obtiene el valor del campo de login (puede ser email o nombre de usuario)
        $login = $this->input('email');

        // Determina si el valor ingresado es un email válido o un nombre de usuario
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'name';

        // Prepara las credenciales para la autenticación
        $credentials = [
            $field => $login,
            'password' => $this->input('password'),
        ];

        // Intenta autenticar al usuario con las credenciales
        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            // Si falla la autenticación, incrementa el contador de intentos fallidos
            RateLimiter::hit($this->throttleKey());

            // Lanza una excepción con mensaje de error
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Si la autenticación es exitosa, limpia el contador de intentos fallidos
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    /**
     * Verifica que no se haya excedido el límite de intentos de login
     * 
     * Este método implementa protección contra ataques de fuerza bruta
     * limitando el número de intentos de login fallidos por IP y email
     * 
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        // Verifica si se han excedido los 5 intentos de login fallidos
        // Si no se han excedido, permite continuar con el proceso de autenticación
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        // Dispara un evento de bloqueo para notificar sobre el intento de acceso sospechoso
        // Esto permite registrar logs, enviar alertas o tomar otras medidas de seguridad
        event(new Lockout($this));

        // Calcula cuántos segundos faltan para que se desbloquee el acceso
        // El bloqueo es temporal y se resetea automáticamente después de un tiempo
        $seconds = RateLimiter::availableIn($this->throttleKey());

        // Lanza una excepción de validación con un mensaje informativo
        // que incluye tanto segundos como minutos restantes para el desbloqueo
        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    /**
     * Genera una clave única para el límite de tasa de login
     * 
     * Esta clave se utiliza para identificar los intentos de login fallidos
     * y aplicar la protección contra ataques de fuerza bruta
     * 
     * @return string Clave única para el límite de tasa de login
     */
    public function throttleKey(): string
    {
        // Genera una clave única combinando el email y la IP del usuario
        // La función Str::transliterate convierte caracteres especiales a su equivalente ASCII
        // Str::lower convierte el email a minúsculas para evitar duplicados de claves
        // La concatenación con '|' y la IP del usuario crea una clave única para cada intento de login
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
