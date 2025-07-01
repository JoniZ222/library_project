import LibrarianLayout from '@/layouts/librarian-layout';
import { Head } from '@inertiajs/react';

export default function LibrarianDashboard() {
    return (
        <LibrarianLayout>
            <Head title="Dashboard" />
            <div>
                <h1>Dashboard</h1>
            </div>
        </LibrarianLayout>
    );
}