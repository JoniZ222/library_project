import PublicLayout from "@/layouts/public-layout";
import { Reservation } from "@/types/models";
import { Head } from "@inertiajs/react";

function formatearFecha(fecha: string | null) {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function estadoReserva(status: string) {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "approved":
            return "Aprobada";
        case "rejected":
            return "Rechazada";
        case "cancelled":
            return "Cancelada";
        default:
            return status;
    }
}

export default function MyReservations({ reservations, storageUrl }: { reservations: Reservation[], storageUrl: string }) {
    return (
        <PublicLayout>
            <Head title="Mis reservas" />
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Mis reservas</h1>
                {reservations.length === 0 ? (
                    <div className="text-gray-500 dark:text-muted-foreground">No tienes reservas registradas.</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reservations.map((reserva) => (
                            <div
                                key={reserva.id}
                                className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 dark:border-border rounded-lg shadow-sm bg-white dark:bg-card"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    {reserva.book?.cover_image ? (
                                        <img
                                            src={`${storageUrl}/${reserva.book.cover_image}`}
                                            alt={reserva.book.title}
                                            className="w-20 h-28 object-cover rounded shadow"
                                        />
                                    ) : (
                                        <div className="w-20 h-28 bg-gray-100 dark:bg-muted flex items-center justify-center rounded text-gray-400 dark:text-muted-foreground text-xs">
                                            Sin portada
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="font-semibold text-lg text-gray-900 dark:text-foreground">{reserva.book?.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-muted-foreground mb-2">ISBN: {reserva.book?.isbn}</div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Estado:</span>
                                        <span
                                            className={
                                                "px-2 py-0.5 rounded " +
                                                (reserva.status === "approved"
                                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                                                    : reserva.status === "pending"
                                                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"
                                                    : reserva.status === "rejected"
                                                    ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                                                    : reserva.status === "cancelled"
                                                    ? "bg-gray-200 dark:bg-muted text-gray-500 dark:text-muted-foreground"
                                                    : "bg-gray-100 dark:bg-muted text-gray-700 dark:text-foreground")
                                            }
                                        >
                                            {estadoReserva(reserva.status)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Reservado el:</span>
                                        <span>{formatearFecha(reserva.reserved_at)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Expira:</span>
                                        <span>{formatearFecha(reserva.expires_at)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Devolver antes de:</span>
                                        <span>{formatearFecha(reserva.planned_return_date)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-foreground">Motivo:</span>
                                        <span className="text-gray-600 dark:text-muted-foreground">{reserva.reason}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}