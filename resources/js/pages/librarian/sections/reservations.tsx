import { useState } from "react";
import { SharedData, User } from "@/types";
import { Badge } from "@/components/ui/badge";
import ModalLoan from "@/components/modal-loan";
import { Button } from "@/components/ui/button";
import { Head, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import LibrarianLayout from "@/layouts/librarian-layout";
import { Book, PaginatedResponse, Reservation } from "@/types/models";
import { useSmartTableNavigation } from "@/hooks/use-table-navigation";
import { markAsNotCollected, destroy } from "@/utils/librarian-reservation";
import { BookOpen, MoreHorizontal, Trash, CalendarCheck, CalendarX, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Reservations({ reservations, filters, storageUrl, pagination }: {
    reservations: PaginatedResponse<Reservation>,
    filters: { search: string, perPage: number },
    storageUrl: string,
    pagination: { current_page: number, last_page: number, per_page: number, total: number, from: number, to: number, links: string }
}) {
    // Estados para el modal de préstamo
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const { auth } = usePage<SharedData>().props;
    const librarianId = auth?.user?.id;

    const columns: ColumnDef<Reservation>[] = [
        {
            accessorKey: "book.title",
            header: "Libro",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    {row.original.book?.cover_image && (
                        <img
                            src={`${storageUrl}/${row.original.book.cover_image}`}
                            alt={row.original.book.title}
                            className="w-10 h-14 object-cover rounded-md border border-border"
                        />
                    )}
                    <span className="font-medium">{row.original.book?.title || "Desconocido"}</span>
                </div>
            ),
        },
        {
            accessorKey: "user.name",
            header: "Usuario",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{row.original.user?.name || "Desconocido"}</span>
                    <span className="text-muted-foreground text-sm">
                        ({row.original.user?.email || "Sin email"})
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const status = row.original.status;
                let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
                let icon = null;

                switch (status) {
                    case "pending":
                        variant = "secondary";
                        icon = <Clock className="h-3 w-3 mr-1" />;
                        break;
                    case "approved":
                        variant = "default";
                        icon = <CalendarCheck className="h-3 w-3 mr-1" />;
                        break;
                    case "rejected":
                        variant = "destructive";
                        icon = <CalendarX className="h-3 w-3 mr-1" />;
                        break;
                    case "cancelled":
                        variant = "outline";
                        icon = <CalendarX className="h-3 w-3 mr-1" />;
                        break;
                }

                return (
                    <Badge variant={variant} className="flex items-center">
                        {icon}
                        {status === "pending" && "Pendiente"}
                        {status === "approved" && "Aprobada"}
                        {status === "rejected" && "Rechazada"}
                        {status === "cancelled" && "Cancelada"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "reserved_at",
            header: "Fecha de reserva",
            cell: ({ row }) => {
                const fecha = row.original.reserved_at ? new Date(row.original.reserved_at) : null;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {fecha
                                ? fecha.toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })
                                : "Sin fecha"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {fecha
                                ? fecha.toLocaleTimeString("es-MX", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                                : ""}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "expires_at",
            header: "Fecha de vencimiento",
            cell: ({ row }) => {
                const fecha = row.original.expires_at ? new Date(row.original.expires_at) : null;
                const now = new Date();
                const isExpired = fecha && fecha < now;

                return (
                    <div className={`flex flex-col ${isExpired ? "text-destructive" : ""}`}>
                        <span className="font-medium">
                            {fecha
                                ? fecha.toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })
                                : "Sin fecha"}
                        </span>
                        <span className="text-xs">
                            {fecha
                                ? fecha.toLocaleTimeString("es-MX", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                                : ""}
                        </span>
                        {isExpired && (
                            <span className="text-xs text-destructive mt-1">
                                Vencida
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "reason",
            header: "Motivo",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate" title={row.original.reason || "Sin motivo"}>
                    {row.original.reason || "Sin motivo"}
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: "Acciones",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-accent"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedReservation(row.original);
                                setSelectedBook(row.original.book);
                                setSelectedUser(row.original.user);
                                setShowLoanModal(true);
                            }}
                            className="cursor-pointer hover:bg-accent"
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>Marcar como recogido</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => markAsNotCollected(row.original.id.toString())}
                            className="cursor-pointer hover:bg-accent"
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>Marcar como no recogida</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => destroy(row.original.id.toString())}
                            className="cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Eliminar reserva</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }
    ];

    const {
        handlePageChange,
        handlePerPageChange,
        handleSearch
    } = useSmartTableNavigation(
        filters,
        {
            routeName: 'librarian.books.reservations',
        }
    );

    return (
        <LibrarianLayout>
            <Head title="Reservas" />
            <div className="flex flex-col gap-4 px-4 py-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-foreground">Reservas de Libros</h1>
                    <p className="text-muted-foreground">
                        Gestiona las reservas de libros realizadas por los usuarios
                    </p>
                </div>

                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={reservations as unknown as PaginatedResponse<Reservation>}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <ModalLoan
                open={showLoanModal}
                onOpenChange={setShowLoanModal}
                book={selectedBook as Book}
                user={selectedUser as User}
                reservation={selectedReservation as Reservation}
                librarianId={librarianId}
                storageUrl={storageUrl}
                due_date={selectedReservation?.expires_at as string | null}
                librarian={auth.user as User}
            />
        </LibrarianLayout>
    );
}