import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    redirect?: string;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    redirect?: string;
}

export default function Login({ status, canResetPassword, redirect }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
        redirect: redirect || '/',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Iniciar sesión" description="Ingresa tus credenciales para acceder a tu cuenta">
            <Head title="Iniciar sesión" />

            <form className="space-y-6" onSubmit={submit}>
                {/* Header del formulario */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-card-foreground">
                        Credenciales de acceso
                    </h2>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Acceso
                    </Badge>
                </div>

                {/* Email o Usuario */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                        Correo electrónico o usuario
                    </Label>
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <Input
                            id="email"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tu@email.com o usuario"
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                            Contraseña
                        </Label>
                        {canResetPassword && (
                            <TextLink href={route('password.request')} className="text-xs text-primary hover:text-primary/80" tabIndex={5}>
                                ¿Olvidaste tu contraseña?
                            </TextLink>
                        )}
                    </div>
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <InputError message={errors.password} />
                </div>
                {redirect &&
                    <input
                        type="hidden"
                        name="redirect"
                        value={redirect}
                        onChange={(e) => setData('redirect', e.target.value)}
                        tabIndex={6} />
                }

                {/* Recordar sesión */}
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onClick={() => setData('remember', !data.remember)}
                        tabIndex={3}
                    />
                    <Label htmlFor="remember" className="text-sm text-card-foreground">
                        Recordar sesión
                    </Label>
                </div>

                {/* Botón de envío */}
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Iniciando sesión...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Iniciar sesión
                        </div>
                    )}
                </Button>

                {/* Enlace de registro */}
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                        ¿No tienes una cuenta?{' '}
                        <TextLink href={route('register')} tabIndex={5} className="text-primary hover:text-primary/80 font-medium">
                            Registrarse
                        </TextLink>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-muted/40 rounded-lg border border-border/60 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-card-foreground mb-1">El conocimiento te espera</p>
                            <p>Detrás de cada libro hay un mundo por descubrir. Esta biblioteca digital es tu puente hacia el conocimiento físico que reside en nuestros estantes.</p>
                        </div>
                    </div>
                </div>
            </form>

            {/* Mensaje de estado */}
            {status && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">{status}</p>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
