import { type Author } from "@/types/models";
import React, { useState } from 'react';
import { Head, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useCrudModal } from "@/hooks/use-create-modal";
import { useSmartTableNavigation } from '@/hooks/use-table-navigation';
import { CrudModal } from "@/components/ui/crud-modal";
import LibrarianLayout from "@/layouts/librarian-layout";
import ManagementBooksLayout from "@/layouts/librarian/management-books";
import { AuthorForm } from "@/components/forms/author-form";

// Definir el tipo PaginatedResponse localmente para evitar conflictos
interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface AuthorProps {
    authors: PaginatedResponse<Author>
    filters: {
        search: string
        perPage: number
    }
}

export default function Author(props: AuthorProps) {
    const { authors, filters } = props;
    const [formData, setFormData] = useState({
        full_name: '',
        biography: '',
        image: null as File | null,
    });
    const [errors, setErrors] = useState<any>({});

    const {
        isOpen,
        operation,
        selectedItem,
        openCreate,
        openEdit,
        openDelete,
        openView,
        close,
    } = useCrudModal();

    const {
        handlePageChange,
        handlePerPageChange,
        handleSearch,
    } = useSmartTableNavigation(filters, {
        routeName: 'librarian.authors',
    });

    // Función para manejar cambios en el formulario
    const handleFormChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
        // Limpiar error del campo si existe
        if (errors[key]) {
            setErrors((prev: any) => ({ ...prev, [key]: null }));
        }
    };

    // Función para crear autor
    const handleCreateAuthor = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('full_name', formData.full_name);
        formDataToSend.append('biography', formData.biography);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        router.post(route('librarian.authors.store'), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ full_name: '', biography: '', image: null });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    // Función para editar autor
    const handleEditAuthor = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedItem) return;

        const formDataToSend = new FormData();
        formDataToSend.append('full_name', formData.full_name);
        formDataToSend.append('biography', formData.biography);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        formDataToSend.append('_method', 'PUT');

        router.post(route('librarian.authors.update', selectedItem.id), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ full_name: '', biography: '', image: null });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    // Función para eliminar autor
    const handleDeleteAuthor = () => {
        if (!selectedItem) return;

        router.delete(route('librarian.authors.destroy', selectedItem.id), {
            onSuccess: () => {
                close();
            },
        });
    };

    // Función para abrir modal de edición
    const handleOpenEdit = (author: Author) => {
        setFormData({
            full_name: author.full_name || '',
            biography: author.biography || '',
            image: null,
        });
        setErrors({});
        openEdit(author);
    };

    // Función para abrir modal de creación
    const handleOpenCreate = () => {
        setFormData({ full_name: '', biography: '', image: null });
        setErrors({});
        openCreate();
    };

    // Función para cancelar
    const handleCancel = () => {
        close();
        setFormData({ full_name: '', biography: '', image: null });
        setErrors({});
    };

    const columns: ColumnDef<Author>[] = [
        {
            accessorKey: 'full_name',
            header: 'Nombre',
            cell: ({ row }) => {
                const name = row.getValue('full_name') as string || 'Sin nombre';
                return name;
            }
        },
        {
            accessorKey: 'biography',
            header: 'Biografía',
            cell: ({ row }) => {
                const biography = row.getValue('biography') as string || 'Sin biografía';
                return biography.length > 100 ? `${biography.substring(0, 100)}...` : biography;
            }
        },
        {
            accessorKey: 'created_at',
            header: 'Fecha de Creación',
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at'));
                return date.toLocaleDateString('es-ES');
            }
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const author = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openView(author)}
                        >
                            Ver
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(author)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDelete(author)}
                        >
                            Eliminar
                        </Button>
                    </div>
                );
            }
        }
    ];

    // Renderizar el modal según la operación
    const renderModalContent = () => {
        switch (operation) {
            case 'create':
                return (
                    <AuthorForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleCreateAuthor}
                        onCancel={handleCancel}
                        isSubmitting={false}
                        formTitle="Crear Nuevo Autor"
                    />
                );
            case 'edit':
                return (
                    <AuthorForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleEditAuthor}
                        onCancel={handleCancel}
                        isSubmitting={false}
                        formTitle="Editar Autor"
                        existingImage={selectedItem?.image ? `/storage/${selectedItem.image}` : null}
                    />
                );
            case 'delete':
                return (
                    <div className="space-y-4">
                        <p>¿Estás seguro de que quieres eliminar al autor <strong>{selectedItem?.full_name}</strong>?</p>
                        <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                    </div>
                );
            case 'view':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nombre:</label>
                            <p>{selectedItem?.full_name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Biografía:</label>
                            <p>{selectedItem?.biography || 'Sin biografía'}</p>
                        </div>
                        {selectedItem?.image && (
                            <div>
                                <label className="text-sm font-medium">Imagen:</label>
                                <img
                                    src={`/storage/${selectedItem.image}`}
                                    alt={selectedItem.full_name}
                                    className="w-32 h-32 object-cover rounded border mt-2"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium">Fecha de Creación:</label>
                            <p>{selectedItem?.created_at ? new Date(selectedItem.created_at).toLocaleDateString('es-ES') : 'N/A'}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <LibrarianLayout>
            <ManagementBooksLayout>
                <Head title="Autores" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Gestión de Autores</h1>

                    <DataTable
                        columns={columns}
                        data={authors}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={(query) => handleSearch(query, 'manual')}
                        toolbarActions={
                            <Button onClick={handleOpenCreate}>
                                Crear Autor
                            </Button>
                        }
                    />

                    {/* Modal CRUD */}
                    <CrudModal
                        isOpen={isOpen}
                        onClose={close}
                        operation={operation || 'create'}
                        title={
                            operation === 'create' ? 'Crear Nuevo Autor' :
                                operation === 'edit' ? 'Editar Autor' :
                                    operation === 'delete' ? 'Confirmar Eliminación' :
                                        'Ver Autor'
                        }
                        description={
                            operation === 'delete' ? 'Esta acción no se puede deshacer.' :
                                undefined
                        }
                        onSubmit={
                            operation === 'create' ? () => {
                                const form = document.querySelector('form');
                                if (form) form.requestSubmit();
                            } :
                                operation === 'edit' ? () => {
                                    const form = document.querySelector('form');
                                    if (form) form.requestSubmit();
                                } :
                                    operation === 'delete' ? handleDeleteAuthor :
                                        undefined
                        }
                        isLoading={false}
                        showFooter={operation !== 'view'}
                    >
                        {renderModalContent()}
                    </CrudModal>
                </div>
            </ManagementBooksLayout>
        </LibrarianLayout>
    );
}