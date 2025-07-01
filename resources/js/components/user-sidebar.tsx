import { Sheet, SheetContent } from '@/components/ui/sheet';
import { type User } from '@/types';
import { X, User as UserIcon, BookOpen, Bookmark, Settings, LogOut, Star, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

interface UserSidebarProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



export function UserSidebar({ user, open, onOpenChange }: UserSidebarProps) {

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm p-0 flex flex-col bg-background">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full border-2 border-muted-foreground overflow-hidden w-12 h-12 flex items-center justify-center bg-muted">
                            {/* Avatar grande */}
                            <img
                                src={user.avatar || ''}
                                alt={user.name}
                                className="w-12 h-12 object-cover"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-base leading-tight">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                </div>

                {/* Opciones principales */}
                <nav className="flex-1 overflow-y-auto px-2 py-4">
                    <ul className="space-y-1">
                        <li>
                            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                <span>Mi perfil</span>
                            </a>
                        </li>
                        <li>
                            <a href={route('reader.my-loans')} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                                <span>Mis préstamos</span>  
                            </a>
                        </li>
                        <li>
                            <a href={route('reader.my-reservations')} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
                                <Bookmark className="h-5 w-5 text-muted-foreground" />
                                <span>Mis reservas</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
                                <Star className="h-5 w-5 text-muted-foreground" />
                                <span>Favoritos</span>
                            </a>
                        </li>
                    </ul>

                    <hr className="my-4 border-muted-foreground" />
                    <div className="flex flex-col gap-2">
                        <ul>
                            <li>
                                <a href={route('settings.profile.reader')} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
                                    <Settings className="h-5 w-5 text-muted-foreground" />
                                    <span>Configuración</span>
                                </a>
                            </li>

                        </ul>
                    </div>

                </nav>

                {/* Cerrar sesión */}
                <div className="border-t p-4">
                    <Link href={route('logout')} method="post" as="button" onClick={handleLogout} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
                        <LogOut className="h-5 w-5" />
                        Cerrar sesión
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
} 