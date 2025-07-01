import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/layouts/auth-layout";

interface ActivateAccountProps {
    token: string;
    matricula: string;
}

export default function ActivateAccount({ token, matricula }: ActivateAccountProps) {
    const { data, setData, post, processing, errors } = useForm({
        password: "",
        password_confirmation: "",
        name: "",
        email: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("activation.activate", { token }));
    };

    return (
        <AuthLayout title="Completa tu registro" description="Configura tu cuenta para comenzar a usar la biblioteca">
            <Head title="Activación de cuenta" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header del formulario */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-card-foreground">
                        Información de la cuenta
                    </h2>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Activación
                    </Badge>
                </div>

                {/* Información de matrícula */}
                <div className="bg-muted/40 rounded-lg p-4 border border-border/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                            Matrícula: <span className="font-mono font-bold text-primary">{matricula}</span>
                        </p>
                    </div>
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
                            placeholder="Ingresa tu nombre completo"
                            value={data.name}
                            onChange={e => setData("name", e.target.value)}
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.name}
                        </p>
                    )}
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
                            placeholder="tu@email.com"
                            value={data.email}
                            onChange={e => setData("email", e.target.value)}
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                        </p>
                    )}
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
                            placeholder="••••••••"
                            value={data.password}
                            onChange={e => setData("password", e.target.value)}
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.password}
                        </p>
                    )}
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
                            placeholder="••••••••"
                            value={data.password_confirmation}
                            onChange={e => setData("password_confirmation", e.target.value)}
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Botón de envío */}
                <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Activando cuenta...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Activar cuenta
                        </div>
                    )}
                </Button>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-muted/40 rounded-lg border border-border/60 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-card-foreground mb-1">Información importante</p>
                            <p>Una vez activada tu cuenta, podrás acceder al panel que le corresponda según su rol.</p>
                        </div>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}