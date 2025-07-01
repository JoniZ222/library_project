import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart, Book, BookOpen, Calendar, History, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard', 
        href: '/librarian/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Libros',
        href: '/books/list',
        icon: Book,
    },
    {
        title: 'Prestamos',
        href: '/books/loans',
        icon: BookOpen,
    },
    {
        title: 'Reservas',
        href: '/books/reservations',
        icon: Calendar,
    },
    {
        title: 'Devoluciones',
        href: '/books/returns',
        icon: BookOpen,
    },
    {
        title: 'Reportes',
        href: '/books/reports',
        icon: BarChart,
    },
    {
        title: 'Historial',
        href: '/books/history',
        icon: History,
    }

];

export function LibrarianSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/librarian/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
