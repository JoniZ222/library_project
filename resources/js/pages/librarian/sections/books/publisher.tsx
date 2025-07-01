import React, { useState } from 'react';
import LibrarianLayout from "@/layouts/librarian-layout";
import { useSmartTableNavigation } from '@/hooks/use-table-navigation';
import ManagementBooksLayout from "@/layouts/librarian/management-books";
import { Head, router } from "@inertiajs/react";
import { type Publisher } from "@/types/models";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useCrudModal } from "@/hooks/use-create-modal";
import { PublisherForm } from "@/components/forms/publisher-form";
import { CrudModal } from "@/components/ui/crud-modal";
import { PaginatedResponse } from '@/types/models';

interface PublisherProps {
    publishers: PaginatedResponse<Publisher>
    filters: {
        search: string
        perPage: number
    }
}

export default function Publisher(props: PublisherProps) {
    const { publishers, filters } = props;
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
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
        routeName: 'librarian.publishers',
    });

    // Función para manejar cambios en el formulario
    const handleFormChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
        // Limpiar error del campo si existe
        if (errors[key]) {
            setErrors((prev: any) => ({ ...prev, [key]: null }));
        }
    };

    // Función para crear editorial
    const handleCreatePublisher = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('website', formData.website);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        router.post(route('librarian.publishers.store'), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ name: '', address: '', phone: '', email: '', website: '', image: null });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    // Función para editar editorial
    const handleEditPublisher = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedItem) return;

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('website', formData.website);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        formDataToSend.append('_method', 'PUT');

        router.post(route('librarian.publishers.update', selectedItem.id), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ name: '', address: '', phone: '', email: '', website: '', image: null });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    // Función para eliminar editorial
    const handleDeletePublisher = () => {
        if (!selectedItem) return;

        router.delete(route('librarian.publishers.destroy', selectedItem.id), {
            onSuccess: () => {
                close();
            },
        });
    };

    // Función para abrir modal de edición
    const handleOpenEdit = (publisher: Publisher) => {
        setFormData({
            name: publisher.name || '',
            address: publisher.address || '',
            phone: publisher.phone || '',
            email: publisher.email || '',
            website: publisher.website || '',
            image: null,
        });
        setErrors({});
        openEdit(publisher);
    };

    // Función para abrir modal de creación
    const handleOpenCreate = () => {
        setFormData({ name: '', address: '', phone: '', email: '', website: '', image: null });
        setErrors({});
        openCreate();
    };

    // Función para cancelar
    const handleCancel = () => {
        close();
        setFormData({ name: '', address: '', phone: '', email: '', website: '', image: null });
        setErrors({});
    };

    const columns: ColumnDef<Publisher>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => {
                const name = row.getValue('name') as string || 'Sin nombre';
                return name;
            }
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                const email = row.getValue('email') as string || 'Sin email';
                return email;
            }
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
            cell: ({ row }) => {
                const phone = row.getValue('phone') as string || 'Sin teléfono';
                return phone;
            }
        },
        {
            accessorKey: 'website',
            header: 'Sitio Web',
            cell: ({ row }) => {
                const website = row.getValue('website') as string || 'Sin sitio web';
                return website.length > 30 ? `${website.substring(0, 30)}...` : website;
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
                const publisher = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openView(publisher)}
                        >
                            Ver
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(publisher)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDelete(publisher)}
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
                    <PublisherForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleCreatePublisher}
                        onCancel={handleCancel}
                        isSubmitting={false}
                        formTitle="Crear Nueva Editorial"
                    />
                );
            case 'edit':
                return (
                    <PublisherForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleEditPublisher}
                        onCancel={handleCancel}
                        isSubmitting={false}
                        formTitle="Editar Editorial"
                        existingImage={selectedItem?.image ? `/storage/${selectedItem.image}` : null}
                    />
                );
            case 'delete':
                return (
                    <div className="space-y-4">
                        <p>¿Estás seguro de que quieres eliminar la editorial <strong>{selectedItem?.name}</strong>?</p>
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
                            <label className="text-sm font-medium">Dirección:</label>
                            <p>{selectedItem?.address || 'Sin dirección'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Teléfono:</label>
                            <p>{selectedItem?.phone || 'Sin teléfono'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email:</label>
                            <p>{selectedItem?.email || 'Sin email'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Sitio Web:</label>
                            <p>{selectedItem?.website || 'Sin sitio web'}</p>
                        </div>
                        {selectedItem?.image && (
                            <div>
                                <label className="text-sm font-medium">Logo:</label>
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
                <Head title="Editoriales" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Gestión de Editoriales</h1>

                    <DataTable
                        columns={columns}
                        data={publishers}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={(query) => handleSearch(query, 'manual')}
                        toolbarActions={
                            <Button onClick={handleOpenCreate}>
                                Crear Editorial
                            </Button>
                        }
                    />

                    {/* Modal CRUD */}
                    <CrudModal
                        isOpen={isOpen}
                        onClose={close}
                        operation={operation || 'create'}
                        title={
                            operation === 'create' ? 'Crear Nueva Editorial' :
                                operation === 'edit' ? 'Editar Editorial' :
                                    operation === 'delete' ? 'Confirmar Eliminación' :
                                        'Ver Editorial'
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
                                    operation === 'delete' ? handleDeletePublisher :
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
