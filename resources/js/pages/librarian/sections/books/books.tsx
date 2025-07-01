import React from 'react';
import { Book } from "@/types/models";
import { Head, Link } from "@inertiajs/react";
import { useExport } from '@/hooks/use-export';
import { Button } from "@/components/ui/button";
import { PaginatedResponse } from '@/types/models';
import { DataTable } from "@/components/ui/data-table";
import LibrarianLayout from "@/layouts/librarian-layout";
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { createBookColumns } from '@/config/table-columns';
import { TemporaryAlert } from "@/components/temporary-alert";
import { TableExportDropdown } from '@/components/ui/export-dropdown';
import { useSmartTableNavigation } from '@/hooks/use-table-navigation';
import ManagementBooksLayout from "@/layouts/librarian/management-books";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { PlusCircleIcon, PlusIcon } from 'lucide-react';

export default function Books({ books, filters, pagination }: {
    books: PaginatedResponse<Book>,
    filters: { search: string, perPage: number },
    pagination: { current_page: number, last_page: number, per_page: number, total: number, from: number, to: number, links: string }
}) {
    // Hook para manejo de eliminación
    const {
        deleteModal,
        alert: deleteAlert,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleAlertClose: handleDeleteAlertClose,
    } = useDeleteModal<Book>(
        (id) => route('librarian.books.destroy', id),
        {
            successMessage: (book) => `El libro "${book.title}" ha sido eliminado exitosamente.`,
            errorMessage: 'Error al eliminar el libro. Por favor, inténtalo de nuevo.',
        }
    );

    // Hook para navegación de tabla
    const {
        handlePageChange,
        handlePerPageChange,
        handleSearch,
    } = useSmartTableNavigation(filters, {
        routeName: 'librarian.books.list',
    });


    // Hook para exportación
    const exportConfig = {
        pdf: route('reports.books.pdf'),
        csv: route('reports.books.csv'),
        excel: route('reports.books.excel')
    };

    const {
        exportLoading,
        alert: exportAlert,
        handleExport,
        handleAlertClose: handleExportAlertClose,
    } = useExport(exportConfig);

    // Configurar columnas
    const columns = createBookColumns({
        onDeleteClick: handleDeleteClick,
        editRoute: (id) => route('librarian.books.edit', { id }),
    });

    // Combinar alertas
    const currentAlert = deleteAlert.isVisible ? deleteAlert : exportAlert;
    const handleAlertClose = deleteAlert.isVisible ? handleDeleteAlertClose : handleExportAlertClose;

    return (
        <LibrarianLayout>
            <ManagementBooksLayout>
                <Head title="Libros" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-foreground">Libros</h1>
                        <p className="text-muted-foreground">
                            Gestiona los libros disponibles en la biblioteca
                        </p>
                    </div>

                    <div className='bg-card rounded-lg border boder-border p-6 shadow-sm'>
                        <DataTable
                            columns={columns}
                            data={books}
                            initialSearchValue={filters.search}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                            onSearch={(query) => handleSearch(query, 'querybuilder')}
                            toolbarActions={
                                <div className="flex gap-2">
                                    <TableExportDropdown
                                        onExport={handleExport}
                                        loading={exportLoading}
                                    />
                                    <Button asChild>
                                        <Link href={route('librarian.books.create')}>
                                            <PlusCircleIcon className="w-4 h-4 mr-2" />
                                            Agregar libro
                                        </Link>
                                    </Button>
                                </div>
                            }
                        />
                    </div>
                </div>

                {/* Modal de confirmación de eliminación */}
                <DeleteConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar Libro"
                    message={`¿Estás seguro de que quieres eliminar el libro "${deleteModal.item?.title}"?`}
                    isLoading={deleteModal.isLoading}
                />

                {/* Alerta temporal */}
                <TemporaryAlert
                    isVisible={currentAlert.isVisible}
                    message={currentAlert.message}
                    type={currentAlert.type}
                    onClose={handleAlertClose}
                />
            </ManagementBooksLayout>
        </LibrarianLayout>
    );
}