import LibrarianLayout from "@/layouts/librarian-layout";
import { Head } from "@inertiajs/react";

export default function History() {
    return (
        <LibrarianLayout>
            <Head title="Historial" />
            <div className="flex flex-col gap-4">
                <h1>History</h1>
            </div>
        </LibrarianLayout>
    );
}