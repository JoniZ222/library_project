import React, { useState } from "react";
import librarianLayout from "@/layouts/librarian-layout";
import ManagementBooksLayout from "@/layouts/librarian/management-books";
import { router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { type Inventory } from "@/types/models";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useCrudModal } from "@/hooks/use-create-modal";
import { InventoryForm } from "@/components/forms/inventory-form";
import { CrudModal } from "@/components/ui/crud-modal";
import { format } from "path";
import { EyeIcon, PencilIcon } from "lucide-react";
import LibrarianLayout from "@/layouts/librarian-layout";
import { PaginatedResponse } from '@/types/models';
import { useSmartTableNavigation } from '@/hooks/use-table-navigation';


interface InventoryProps {
    inventory: PaginatedResponse<Inventory>
    filters: {
        search: string
        perPage: number
    }
}

export default function Inventory(props: InventoryProps) {
    const { inventory, filters } = props;
    const [formData, setFormData] = useState({
        quantity: '',
        condition: 'nuevo',
        location: '',
        status: 'disponible',
        notes: '',
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
        routeName: 'librarian.inventory',
    });

    const handleFormChange = (key: string, value: any) => {
        setFormData({ ...formData, [key]: value });
        if (errors[key]) {
            setErrors((prev: any) => ({ ...prev, [key]: null }));
        }
    }

    const handleEditInventory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        const formDataToSend = new FormData();
        formDataToSend.append('quantity', formData.quantity);
        formDataToSend.append('condition', formData.condition);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('notes', formData.notes);
        formDataToSend.append('_method', 'PUT');

        router.post(route('librarian.inventory.update', selectedItem.id), formDataToSend, {
            onSuccess: () => {
                close();
                setFormData({ quantity: '', condition: 'nuevo', location: '', status: 'disponible', notes: '' });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            }
        });
    }

    const handleOpenEdit = (inventory: Inventory) => {
        setFormData({
            quantity: inventory.quantity.toString(),
            condition: inventory.condition || '',
            location: inventory.location || '',
            status: inventory.status || '',
            notes: inventory.notes || '',
        });
        openEdit(inventory);
    }

    const handleOpenView = (inventory: Inventory) => {
        setFormData({
            quantity: inventory.quantity.toString(),
            condition: inventory.condition || '',
            location: inventory.location || '',
            status: inventory.status || '',
            notes: inventory.notes || '',
        });
        openView(inventory);
    }

    const columns: ColumnDef<Inventory>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Libro',
            accessorKey: 'book.title',
            cell: ({ row }) => {
                const book = row.original.book;
                return (
                    <div className="flex flex-col">
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                );
            },
        },
        {
            header: 'Cantidad',
            accessorKey: 'quantity',
        },
        {
            header: 'Condición',
            accessorKey: 'condition',
        },

        {
            header: 'Ubicación',
            accessorKey: 'location',
        },
        {
            header: 'Estado',
            accessorKey: 'status',
        },
        {
            header: 'Notas',
            accessorKey: 'notes',
        },
        {
            header: 'Acciones',
            cell: ({ row }) => {
                const inventory = row.original;
                return (
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenView(inventory)}>
                            <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleOpenEdit(inventory)}>
                            <PencilIcon className="w-4 h-4" />
                        </Button>
                    </div>
                );
            },
        }
    ];

    const renderModalContent = () => {
        switch (operation) {
            case 'edit':
                return (
                    <InventoryForm
                        data={formData}
                        setData={handleFormChange}
                        errors={errors}
                        onSubmit={handleEditInventory}
                        onCancel={close}
                        isSubmitting={false}
                        formTitle="Editar Inventario"
                    />
                );
            case 'view':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Cantidad:</label>
                            <p>{selectedItem?.quantity}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Condición:</label>
                            <p>{selectedItem?.condition}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Ubicación:</label>
                            <p>{selectedItem?.location}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Estado:</label>
                            <p>{selectedItem?.status}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Notas:</label>
                            <p>{selectedItem?.notes}</p>
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
                <Head title="Inventario" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Gestión de Inventario</h1>
                    <DataTable
                        columns={columns}
                        data={inventory}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={(query) => handleSearch(query, 'manual')}
                    />
                    <CrudModal
                        isOpen={isOpen}
                        onClose={close}
                        onCancel={close}
                        operation={operation || 'edit'}
                        title={
                            operation === 'edit' ? 'Editar Inventario' :
                                'Ver Inventario'
                        }
                        onSubmit={
                            operation === 'edit' ? () => {
                                const form = document.querySelector('form');
                                if (form) form.requestSubmit();
                            } : undefined
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