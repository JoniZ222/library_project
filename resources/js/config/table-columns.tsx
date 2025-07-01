import { ColumnDef } from "@tanstack/react-table";
import { Book } from "@/types/models";
import { TextCell, RelationCell, AuthorsCell, StatusCell } from "@/components/table-cells";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

interface CreateColumnsOptions {
    onDeleteClick: (book: Book) => void;
    editRoute: (id: number) => string;
}

export const createBookColumns = ({ onDeleteClick, editRoute }: CreateColumnsOptions): ColumnDef<Book>[] => [
    {
        accessorKey: 'title',
        header: () => <span className="font-semibold text-foreground">Título</span>,
        cell: ({ row }) => (
            <TextCell
                value={row.original.title}
                className="font-medium text-primary hover:text-primary/80"
            />
        ),
        size: 200
    },
    {
        accessorKey: 'isbn',
        header: () => <span className="font-semibold text-foreground">ISBN</span>,
        cell: ({ row }) => (
            <TextCell
                value={row.original.isbn}
                className="font-mono text-sm bg-muted/20 px-2 py-1 rounded"
            />
        ),
        size: 150
    },
    {
        accessorKey: 'folio',
        header: () => <span className="font-semibold text-foreground">Folio</span>,
        cell: ({ row }) => (
            <TextCell
                value={row.original.folio}
                className="text-center font-medium"
            />
        ),
        size: 100
    },
    {
        accessorKey: 'publication_year',
        header: () => <span className="font-semibold text-foreground">Año</span>,
        cell: ({ row }) => (
            <TextCell
                value={row.original.publication_year}
                className="text-center text-muted-foreground"
            />
        ),
        size: 80
    },
    {
        accessorKey: 'category.name',
        header: () => <span className="font-semibold text-foreground">Categoría</span>,
        cell: ({ row }) => (
            <RelationCell
                relation={row.original.category}
                property="name"
                className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-full text-xs"
            />
        ),
        size: 140
    },
    {
        accessorKey: 'publisher.name',
        header: () => <span className="font-semibold text-foreground">Editorial</span>,
        cell: ({ row }) => (
            <RelationCell
                relation={row.original.publisher}
                property="name"
                className="italic text-muted-foreground"
            />
        ),
        size: 150
    },
    {
        accessorKey: 'authors.full_name',
        header: () => <span className="font-semibold text-foreground">Autores</span>,
        cell: ({ row }) => (
            <AuthorsCell
                authors={row.original.authors || []}
                className="flex flex-wrap gap-1"
                authorClassName="text-xs bg-muted/20 px-2 py-1 rounded-full hover:bg-muted/30 transition-colors"
            />
        ),
        size: 200
    },
    {
        accessorKey: 'genre.name',
        header: () => <span className="font-semibold text-foreground">Género</span>,
        cell: ({ row }) => (
            <RelationCell
                relation={row.original.genre}
                property="name"
                className="capitalize text-sm"
            />
        ),
        size: 120
    },
    {
        accessorKey: 'inventory.status',
        header: () => <span className="font-semibold text-foreground">Estado</span>,
        cell: ({ row }) => (
            <StatusCell
                value={row.original.inventory?.status}
                className="px-2 py-1 rounded-full text-xs font-medium"
            />
        ),
        size: 120
    },
    {
        id: 'actions',
        header: () => <span className="font-semibold text-foreground">Acciones</span>,
        cell: ({ row }) => {
            const libro = row.original;
            return (
                <div className="flex gap-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
                    >
                        <Link href={editRoute(libro.id)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClick(libro)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                    </Button>
                </div>
            );
        },
        size: 100,
        enableSorting: false,
        enableHiding: false
    }
];