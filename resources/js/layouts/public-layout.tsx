import { type ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserSidebar } from '@/components/user-sidebar';
import { useInitials } from '@/hooks/use-initials';
import AppLogo from '@/components/app-logo';
import { BookOpen, Home, Info, Phone, Mail } from 'lucide-react';
import { SharedData, User } from '@/types/index';
import { Toaster } from 'sonner';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [userSidebarOpen, setUserSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Toaster
                position="top-right"
                className="md:top-4 md:right-4 top-2 right-2"
                toastOptions={{
                    style: {
                        maxWidth: '90vw',
                        width: 'auto',
                    },
                }}
            />
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/catalog" className="flex items-center space-x-2">
                                <AppLogo />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/catalog" className={navigationMenuTriggerStyle()}>
                                            <Home className="mr-2 h-4 w-4" />
                                            Inicio
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link href="/catalog" className={navigationMenuTriggerStyle()}>
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Catálogo
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link href="#" className={navigationMenuTriggerStyle()}>
                                            <Info className="mr-2 h-4 w-4" />
                                            Acerca de
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                    onClick={() => setUserSidebarOpen(true)}
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/login">Iniciar Sesión</Link>
                                    </Button>
                                    <Button size="sm" asChild>
                                        <Link href="/register">Registrarse</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* User Sidebar */}
            {auth.user && (
                <UserSidebar
                    user={auth.user}
                    open={userSidebarOpen}
                    onOpenChange={setUserSidebarOpen}
                />
            )}

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/40">
                <div className="mx-auto max-w-7xl px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <AppLogo />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Biblioteca digital del CECyTEM. Explora nuestro catálogo de libros y recursos educativos.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Enlaces Rápidos</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">Catálogo</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Novedades</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Préstamos</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Reservas</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Categorías</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">Ficción</Link></li>
                                <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">Ciencia</Link></li>
                                <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">Historia</Link></li>
                                <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">Tecnología</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Contacto</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>(555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>biblioteca@cecytem.edu.mx</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Biblioteca CECyTEM. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-foreground">Política de Privacidad</Link>
                            <Link href="#" className="hover:text-foreground">Términos de Uso</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
} 