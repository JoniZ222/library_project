import LibrarianLayout from "@/layouts/librarian-layout";
import { Head } from "@inertiajs/react";

export default function Returns() {
    return (
        <LibrarianLayout>
            <Head title="Devoluciones" />
            <div className="flex flex-col gap-4">
                <h1>Returns</h1>
            </div>
        </LibrarianLayout>
    );
}