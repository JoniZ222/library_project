import React, { useState } from 'react';
import LibrarianLayout from "@/layouts/librarian-layout";
import ManagementBooksLayout from "@/layouts/librarian/management-books";
import { Head, router } from "@inertiajs/react";
import { type Category } from "@/types/models";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useCrudModal } from "@/hooks/use-create-modal";
import { CategoryForm } from "@/components/forms/category-form";
import { CrudModal } from "@/components/ui/crud-modal";
import { PaginatedResponse } from '@/types/models';
import { useSmartTableNavigation } from '@/hooks/use-table-navigation';

interface CategoryProps {
    categories: PaginatedResponse<Category>
    filters: {
        search: string
        perPage: number
    }
}

export default function Category(props: CategoryProps) {
    const { categories, filters } = props;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
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
        routeName: 'librarian.categories',
    });


    // Función para manejar cambios en el formulario
    const handleFormChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
        // Limpiar error del campo si existe
        if (errors[key]) {
            setErrors((prev: any) => ({ ...prev, [key]: null }));
        }
    };

    // Función para crear categoría
    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        router.post(route('librarian.categories.store'), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ name: '', description: '', image: null });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    // Función para editar categoría
    const handleEditCategory = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedItem) return;

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        formDataToSend.append('_method', 'PUT');

        router.post(route('librarian.categories.update', selectedItem.id), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ name: '', description: '', image: null });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    // Función para eliminar categoría
    const handleDeleteCategory = () => {
        if (!selectedItem) return;

        router.delete(route('librarian.categories.destroy', selectedItem.id), {
            onSuccess: () => {
                close();
            },
        });
    };

    // Función para abrir modal de edición
    const handleOpenEdit = (category: Category) => {
        setFormData({
            name: category.name || '',
            description: category.description || '',
            image: null,
        });
        setErrors({});
        openEdit(category);
    };

    // Función para abrir modal de creación
    const handleOpenCreate = () => {
        setFormData({ name: '', description: '', image: null });
        setErrors({});
        openCreate();
    };

    // Función para cancelar
    const handleCancel = () => {
        close();
        setFormData({ name: '', description: '', image: null });
        setErrors({});
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => {
                const name = row.getValue('name') as string || 'Sin nombre';
                return name;
            }
        },
        {
            accessorKey: 'description',
            header: 'Descripción',
            cell: ({ row }) => {
                const description = row.getValue('description') as string || 'Sin descripción';
                return description.length > 100 ? `${description.substring(0, 100)}...` : description;
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
                const category = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openView(category)}
                        >
                            Ver
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(category)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDelete(category)}
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
                    <CategoryForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleCreateCategory}
                        onCancel={handleCancel}
                        isSubmitting={false}
                        formTitle="Crear Nueva Categoría"
                    />
                );
            case 'edit':
                return (
                    <CategoryForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleEditCategory}
                        onCancel={handleCancel}
                        isSubmitting={false}
                        formTitle="Editar Categoría"
                        existingImage={selectedItem?.image ? `/storage/${selectedItem.image}` : null}
                    />
                );
            case 'delete':
                return (
                    <div className="space-y-4">
                        <p>¿Estás seguro de que quieres eliminar la categoría <strong>{selectedItem?.name}</strong>?</p>
                        <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                    </div>
                );
            case 'view':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nombre:</label>
                            <p>{selectedItem?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Descripción:</label>
                            <p>{selectedItem?.description || 'Sin descripción'}</p>
                        </div>
                        {selectedItem?.image && (
                            <div>
                                <label className="text-sm font-medium">Imagen:</label>
                                <img
                                    src={`/storage/${selectedItem.image}`}
                                    alt={selectedItem.name}
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
                <Head title="Categorías" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>

                    <DataTable
                        columns={columns}
                        data={categories}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={(query) => handleSearch(query, 'manual')}
                        toolbarActions={
                            <Button onClick={handleOpenCreate}>
                                Crear Categoría
                            </Button>
                        }
                    />

                    {/* Modal CRUD */}
                    <CrudModal
                        isOpen={isOpen}
                        onClose={close}
                        operation={operation || 'create'}
                        title={
                            operation === 'create' ? 'Crear Nueva Categoría' :
                                operation === 'edit' ? 'Editar Categoría' :
                                    operation === 'delete' ? 'Confirmar Eliminación' :
                                        'Ver Categoría'
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
                                    operation === 'delete' ? handleDeleteCategory :
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