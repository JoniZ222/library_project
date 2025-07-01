import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Efectos de fondo decorativos */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="w-full max-w-md relative z-10">
                {/* Tarjeta principal con efecto de cristal mejorado */}
                <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/60 shadow-2xl shadow-black/5 dark:shadow-black/20">
                    <div className="p-8">
                        {/* Header con logo institucional */}
                        <div className="text-center mb-8">
                            <Link href={route('home')} className="inline-block group">
                                <div className="flex h-16 w-16 items-center justify-center mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                                    <AppLogoIcon className="size-16" />
                                </div>
                            </Link>
                            <h1 className="text-xl font-semibold text-foreground mb-2">
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>

                {/* Footer con información adicional */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground/80">
                        Sistema de Biblioteca Digital
                    </p>
                </div>
            </div>
        </div>
    );
}
