import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/admin-layout';
import LibrarianSidebarLayout from '@/layouts/librarian/librarian-sidebar-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsPublicLayout from '@/layouts/settings-public/layout-public';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de apariencia',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    // Obtenemos el usuario autenticado desde la página
    const { auth } = usePage().props as any;

    // Determinamos el layout según el rol del usuario
    let ParentLayout: React.ComponentType<any> = AppLayout;
    let SettingsLayoutComponent: React.ComponentType<any> = SettingsLayout;

    if (auth?.user?.role === 'admin') {
        ParentLayout = AdminLayout;
        SettingsLayoutComponent = SettingsLayout;
    } else if (auth?.user?.role === 'librarian') {
        ParentLayout = LibrarianSidebarLayout;
        SettingsLayoutComponent = SettingsLayout;
    } else if (auth?.user?.role === 'reader_public') {
        ParentLayout = PublicLayout;
        SettingsLayoutComponent = SettingsPublicLayout;
    } else if (auth?.user?.role === 'reader_private') {
        ParentLayout = PublicLayout;
        SettingsLayoutComponent = SettingsPublicLayout;
    }

    return (
        <ParentLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de apariencia" />

            <SettingsLayoutComponent>
                <div className="space-y-6">
                    <HeadingSmall title="Ajustes de apariencia" description="Actualiza los ajustes de apariencia de tu cuenta" />
                    <AppearanceTabs />
                </div>
            </SettingsLayoutComponent>
        </ParentLayout>
    );
}
