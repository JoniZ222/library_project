import { ColumnDef } from "@tanstack/react-table";
import { Head } from "@inertiajs/react";
import LibrarianLayout from "@/layouts/librarian-layout";
import { type Loan } from "@/types/models";
import { type PaginatedResponse } from "@/types/models";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";

interface Props {
    loans: PaginatedResponse<Loan>;
    filters: {
        status: string;
        search: string;
    };
}

export default function Loans({ loans, filters }: Props) {

    const columns: ColumnDef<Loan>[] = [
        {
            header: "ID del préstamo",
            accessorKey: "id",
            cell: ({ row }) => {
                return <span>{row.original.id}</span>
            }
        },
        {
            header: "Usuario que tomó el préstamo",
            accessorKey: "user.name",
            cell: ({ row }) => {
                return <span>{row.original.user.name}</span>
            }
        },
        {
            header: "Libro prestado",
            accessorKey: "book.title",
            cell: ({ row }) => {
                return <span>{row.original.book.title}</span>
            }
        },
        {
            header: "Estado del préstamo",
            accessorKey: "status",
            cell: ({ row }) => {
                return <span>{row.original.status}</span>
            }
        },
        {
            header: "Fecha de préstamo del libro",
            accessorKey: "borrowed_at",
            cell: ({ row }) => {
                return <span>{new Date(row.original.borrowed_at).toLocaleDateString()}</span>
            }
        },
        {
            header: "Fecha de devolución del libro",
            accessorKey: "due_date",
            cell: ({ row }) => {
                return <span>{new Date(row.original.due_date).toLocaleDateString()}</span>
            }
        },
        {
            header: "Acciones",
            cell: ({ row }) => {
                return <span>
                    <Button variant="outline" size="icon">
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                </span>
            }
        }

    ]
    return (
        <LibrarianLayout>
            <Head title="Préstamos" />
            <div className="flex flex-col gap-4 px-4 py-6">
                <h1>Préstamos</h1>
                <DataTable
                    columns={columns}
                    data={loans}
                    onPageChange={() => { }}
                    onPerPageChange={() => { }}
                    onSearch={() => { }}
                />
            </div>
        </LibrarianLayout>
    );
}