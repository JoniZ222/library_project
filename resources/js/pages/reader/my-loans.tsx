import PublicLayout from "@/layouts/public-layout";
import { Loan } from "@/types/models";
import { Head } from "@inertiajs/react";

function formatearFecha(fecha: string | null) {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function estadoPrestamo(status: string) {
    switch (status) {
        case "active":
            return "Activo";
        case "returned":
            return "Devuelto";
        case "overdue":
            return "Atrasado";
        default:
            return status;
    }
}

export default function MyLoans({ loans, storageUrl }: { loans: any[], storageUrl: string }) {
    return (
        <PublicLayout>
            <Head title="Mis préstamos" />
            <div className="flex flex-col gap-4 px-4 py-6">
                <h1 className="text-2xl font-bold">Mis préstamos</h1>
                <div className="flex flex-col gap-4">
                    {loans.length === 0 ? (
                        <div className="text-gray-500 dark:text-muted-foreground">No tienes préstamos registrados.</div>
                    ) : (
                        loans.map((prestamo) => (
                            <div
                                key={prestamo.id}
                                className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 dark:border-border rounded-lg shadow-sm bg-white dark:bg-card"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    {prestamo.book?.cover_image ? (
                                        <img
                                            src={`${storageUrl}/${prestamo.book.cover_image}`}
                                            alt={prestamo.book.title}
                                            className="w-20 h-28 object-cover rounded shadow"
                                        />
                                    ) : (
                                        <div className="w-20 h-28 bg-gray-100 dark:bg-muted flex items-center justify-center rounded text-gray-400 dark:text-muted-foreground text-xs">
                                            Sin portada
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="font-semibold text-lg text-gray-900 dark:text-foreground">{prestamo.book?.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-muted-foreground mb-2">ISBN: {prestamo.book?.isbn}</div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Estado:</span>
                                        <span
                                            className={
                                                "px-2 py-0.5 rounded " +
                                                (prestamo.status === "active"
                                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                                                    : prestamo.status === "returned"
                                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                                                    : prestamo.status === "overdue"
                                                    ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                                                    : "bg-gray-100 dark:bg-muted text-gray-700 dark:text-foreground")
                                            }
                                        >
                                            {estadoPrestamo(prestamo.status)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Prestado el:</span>
                                        <span>{formatearFecha(prestamo.borrowed_at)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Fecha de entrega:</span>
                                        <span>{formatearFecha(prestamo.due_date)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Devuelto el:</span>
                                        <span>{formatearFecha(prestamo.returned_at)}</span>
                                    </div>
                                    {prestamo.notes && (
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="font-medium text-gray-700 dark:text-foreground">Notas:</span>
                                            <span className="text-gray-600 dark:text-muted-foreground">{prestamo.notes}</span>
                                        </div>
                                    )}
                                    {prestamo.librarian && (
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="font-medium text-gray-700 dark:text-foreground">Bibliotecario que lo prestó:</span>
                                            <span className="text-gray-600 dark:text-muted-foreground">{prestamo.librarian.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}