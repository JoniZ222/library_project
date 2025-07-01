import LibrarianLayoutTemplate from '@/layouts/librarian/librarian-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface LibrarianLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: LibrarianLayoutProps) => (
    <LibrarianLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Toaster position="top-right"  />
        {children}
    </LibrarianLayoutTemplate>
);
