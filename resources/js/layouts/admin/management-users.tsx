import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Administradores',
        href: '/admin/users',
        icon: null,
    },
    {
        title: 'Bibliotecarios',
        href: '/admin/librarians',
        icon: null,
    },
];

export default function ManagementUsersLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-8 py-8">
            <Heading title="Usuarios" description="Gestiona los usuarios" />

            <div className="flex flex-col space-y-12 lg:flex-row lg:space-y-0 lg:space-x-16">
                <aside className="w-full max-w-xl lg:w-56">
                    <nav className="flex flex-col space-y-3 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start py-3', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-8 md:hidden" />

                <div className="flex-1 md:max-w-4xl">
                    <section className="max-w-4xl space-y-16">{children}</section>
                </div>
            </div>
        </div>
    );
}
