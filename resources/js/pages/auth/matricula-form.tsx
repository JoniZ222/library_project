import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AuthLayout from "@/layouts/auth-layout";

export default function MatriculaForm() {
    const { data, setData, post, processing, errors } = useForm({
        matricula: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("activation.matricula.process"));
    };

    return (
        <AuthLayout title="Activación de cuenta" description="Ingresa tu matrícula para comenzar el proceso de activación">
            <Head title="Activación de cuenta" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header del formulario */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-card-foreground">
                        Verificación de matrícula
                    </h2>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Paso 1 de 2
                    </Badge>
                </div>

                {/* Descripción */}
                <div className="bg-muted/40 rounded-lg p-4 border border-border/60 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-card-foreground mb-1">Proceso de activación</p>
                            <p>Necesitamos verificar tu matrícula para continuar con la activación de tu cuenta.</p>
                        </div>
                    </div>
                </div>

                {/* Campo de matrícula */}
                <div className="space-y-2">
                    <Label htmlFor="matricula" className="text-sm font-medium text-card-foreground">
                        Número de matrícula
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
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" 
                            />
                        </svg>
                        <Input
                            id="matricula"
                            name="matricula"
                            type="text"
                            placeholder="Ej: 2024001"
                            value={data.matricula}
                            onChange={e => setData("matricula", e.target.value)}
                            className="pl-10 bg-background/80 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 text-center font-mono text-lg tracking-wider shadow-sm hover:shadow-md"
                            autoComplete="off"
                            autoFocus
                        />
                    </div>
                    {errors.matricula && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.matricula}
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
                            Verificando...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Continuar
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
                            <p className="font-medium text-card-foreground mb-1">¿No tienes tu matrícula?</p>
                            <p>Contacta a la administración de tu institución para obtener tu número de matrícula.</p>
                        </div>
                    </div>
                </div>

                {/* Proceso de activación */}
                <div className="mt-4">
                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>Verificar matrícula</span>
                        </div>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                            <span>Completar registro</span>
                        </div>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}