import LibrarianLayout from "@/layouts/librarian-layout";
import { Head } from "@inertiajs/react";

export default function Reports() {
    return (
        <LibrarianLayout>
            <Head title="Reportes" />
            <div className="flex flex-col gap-4">
                <h1>Reports</h1>
            </div>
        </LibrarianLayout>
    );
}