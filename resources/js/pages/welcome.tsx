import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    // Función para determinar la ruta del dashboard según el rol del usuario
    const getDashboardRoute = () => {
        if (!auth.user) return route('login');

        switch (auth.user.role) {
            case 'admin':
                return route('admin.dashboard');
            case 'librarian':
                return route('librarian.dashboard');
            case 'reader_public':
                return route('public.catalog');
            default:
                return route('home');
        }
    };

    return (
        <>
            <Head title="Inicio">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex flex-col items-center p-4 sm:p-6 text-foreground lg:justify-center lg:p-8 relative overflow-hidden">
                <div aria-hidden="true" className="w-full h-4" />
                {/* Efectos de fondo decorativos mejorados */}
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
                    <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-tr from-primary/8 via-primary/5 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
                </div>

                {/* Header izquierdo con el logo de la aplicación */}
                <header className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                    <Link
                        href={route('home')}
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2 sm:px-5 sm:py-1.5 text-sm leading-normal text-foreground hover:bg-accent/50 border border-border/60 hover:border-border rounded-lg transition-all duration-200 relative z-50 backdrop-blur-sm"
                    >
                        <AppLogoIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </Link>
                </header>

                {/* Header derecho con navegación */}
                <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {auth.user ? (
                            <Link
                                href={getDashboardRoute()}
                                className="flex items-center justify-center rounded-lg border border-border/60 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm leading-normal text-foreground hover:bg-accent/50 transition-all duration-200 whitespace-nowrap backdrop-blur-sm shadow-sm hover:shadow-md"
                            >
                                Ir a mi panel
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg border border-border/60 hover:bg-accent/50 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
                            >
                                <span className="hidden sm:inline">Iniciar Sesión como Administrador</span>
                                <span className="sm:hidden">Iniciar Sesión</span>
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Si el usuario está autenticado, mostrar bienvenida personalizada */}
                {auth.user ? (
                    <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl z-10 px-4 sm:px-6">
                        <div className="flex flex-col items-center gap-4 sm:gap-6 mt-20 sm:mt-24 mb-8 sm:mb-12">
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center border border-primary/20 shadow-lg">
                                    <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-primary drop-shadow-lg animate-bounce-slow" />
                                </div>
                                <Sparkles className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-foreground px-4">
                                ¡Bienvenido{auth.user.name ? `, ${auth.user.name}` : ''}!
                            </h1>
                            <p className="text-base sm:text-lg text-muted-foreground text-center max-w-xl px-4">
                                Nos alegra verte de nuevo. Accede a tu panel para gestionar tus libros, reservas o explorar el catálogo.
                            </p>
                            <Link
                                href={getDashboardRoute()}
                                className="mt-4 px-6 py-3 sm:px-8 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            >
                                Ir a mi panel
                            </Link>
                            <blockquote className="mt-6 sm:mt-8 text-center italic text-lg sm:text-xl text-muted-foreground max-w-lg px-4 p-4 bg-muted/40 rounded-lg border border-border/60 backdrop-blur-sm">
                                "Un libro es un sueño que tienes en tus manos."
                                <br /><span className="text-sm text-muted-foreground">— Neil Gaiman</span>
                            </blockquote>
                        </div>
                    </main>
                ) : (
                    // Si NO está autenticado, mostrar las tarjetas de registro/acceso
                    <main className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl z-10 px-4 sm:px-6">
                        <div className="text-center mb-8 sm:mb-12 mt-16 sm:mt-20">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-foreground">Sistema de Biblioteca</h1>
                            <p className="text-lg sm:text-xl text-muted-foreground">Selecciona tu tipo de acceso</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl">
                            {/* Tarjeta para Administrador */}
                            <div className="bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-blue-200/50 dark:border-blue-800/30 shadow-lg">
                                        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Administrador</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Acceso completo al sistema con todas las funcionalidades administrativas</p>
                                    <Link
                                        href={route('register.admin')}
                                        className="inline-block w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
                                    >
                                        <span className="hidden sm:inline">Registrarse como Administrador</span>
                                        <span className="sm:hidden">Registrarse</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Tarjeta para Bibliotecario */}
                            <div className="bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-green-200/50 dark:border-green-800/30 shadow-lg">
                                        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Bibliotecario</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Gestión de préstamos, devoluciones y atención al público</p>
                                    <Link
                                        href={route('activation.matricula.form')}
                                        className="inline-block w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
                                    >
                                        <span className="hidden sm:inline">Registrarse como Bibliotecario</span>
                                        <span className="sm:hidden">Registrarse</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Tarjeta para Acceso Público */}
                            <div className="bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-purple-200/50 dark:border-purple-800/30 shadow-lg">
                                        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Acceso Público</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Consulta de catálogo y búsqueda de libros sin registro</p>
                                    <Link
                                        href={route('public.catalog')}
                                        className="inline-block w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
                                    >
                                        Acceder al Catálogo
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </>
    );
}
