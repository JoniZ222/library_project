import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.reader'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Crear cuenta" description="Ingresa tus datos para crear tu cuenta de lector">
            <Head title="Registro" />
            
            <form className="space-y-6" onSubmit={submit}>
                {/* Header del formulario */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-card-foreground">
                        Información personal
                    </h2>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Lector
                    </Badge>
                </div>

                {/* Nombre completo */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
                        Nombre completo
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
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Ingresa tu nombre completo"
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                        Correo electrónico
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
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                            />
                        </svg>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="tu@email.com"
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <Separator className="my-6 bg-border/60" />

                {/* Contraseña */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                        Contraseña
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                            />
                        </svg>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <InputError message={errors.password} />
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-card-foreground">
                        Confirmar contraseña
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                {/* Botón de envío */}
                <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                    tabIndex={5} 
                    disabled={processing}
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creando cuenta...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Crear cuenta
                        </div>
                    )}
                </Button>

                {/* Enlace de login */}
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <TextLink href={route('login')} tabIndex={6} className="text-primary hover:text-primary/80 font-medium">
                            Iniciar sesión
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
                            <p className="font-medium text-card-foreground mb-1">Cuenta de lector</p>
                            <p>Con esta cuenta podrás reservar libros, ver tu historial de préstamos y acceder a todos los servicios de la biblioteca.</p>
                        </div>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
