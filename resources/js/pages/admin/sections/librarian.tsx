import React from 'react'
import { router } from '@inertiajs/react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import AdminLayout from '@/layouts/admin-layout'
import ManagementUsersLayout from '@/layouts/admin/management-users'
import { useCrudModal } from '@/hooks/use-create-modal'
import { LibrarianForm } from '@/components/forms/librarian-form'
import { CrudModal } from '@/components/ui/crud-modal'
import { PaginatedResponse } from '@/types/models'

interface Librarian {
    id: number
    name: string
    email: string
    role: string
    matricula: string
    created_at: string
}


    
interface ManagementUsersProps {
    librarians: PaginatedResponse<Librarian>
}

export default function ManagementUsers({ librarians }: ManagementUsersProps) {
    const {
        isOpen,
        operation,
        selectedItem,
        openCreate,
        openEdit,
        openDelete,
        openView,
        close,
    } = useCrudModal()


    const handlePageChange = (page: number) => {
        router.post(route('admin.librarians'), { page }, {
            preserveState: true,
            replace: true
        })
    }

    const handlePerPageChange = (perPage: string) => {
        router.post(route('admin.librarians'), { per_page: perPage }, {
            preserveState: true,
            replace: true
        })
    }

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.post(route('admin.librarians'), { search: query }, {
                preserveState: true,
                replace: true
            })
        } else {
            router.post(route('admin.librarians'), {}, {
                preserveState: true,
                replace: true
            })
        }
    }

    const handleCreateUser = (data: Librarian) => {
        router.post(route('admin.librarians.store'), data, {
            onSuccess: () => {
                close()
            },
        })
    }

    const handleEditUser = (data: Librarian) => {
        if (selectedItem) {
            router.put(route('admin.librarians.update', selectedItem.id), data, {
                onSuccess: () => {
                    close()
                },
            })
        }
    }

    const handleDeleteUser = () => {
        if (selectedItem) {
            router.delete(route('admin.librarians.destroy', selectedItem.id), {
                onSuccess: () => {
                    close()
                },
            })
        }
    }


    const columns: ColumnDef<Librarian>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => {
                const name = row.getValue('name') as string || 'Sin nombre'
                return name
            }   
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                const email = row.getValue('email') as string || 'Sin email'
                return email
            }
        },
        {
            accessorKey: 'role',
            header: 'Rol',
            cell: ({ row }) => {
                const role = row.getValue('role') as string || 'N/A'
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${role === 'admin' ? 'bg-red-100 text-red-800' :
                        role === 'librarian' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {role}
                    </span>
                )
            }
        },
        {
            accessorKey: 'matricula',
            header: 'Matrícula',
            cell: ({ row }) => {
                const matricula = row.getValue('matricula') as string || 'N/A'
                return matricula
            }
        },
        {
            accessorKey: 'created_at',
            header: 'Fecha de Creación',
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at')) 
                return date.toLocaleDateString('es-ES')
            }
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openView(user)}
                        >
                            Ver
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(user)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDelete(user)}
                        >
                            Eliminar
                        </Button>
                    </div>
                )
            }
        }
    ]

    const renderModalContent = () => {
        switch (operation) {
            case 'create':
                return (
                    <LibrarianForm
                        isCreate={true}
                        onSubmit={handleCreateUser}
                        isLoading={router.processing}
                    />
                )
            case 'edit':
                return (
                    <LibrarianForm
                        user={selectedItem}
                        isCreate={false}
                        onSubmit={handleEditUser}
                        isLoading={router.processing}
                    />
                )

            case 'delete':
                return (
                    <div className="space-y-4">
                        <p>¿Estás seguro de que quieres eliminar al usuario <strong>{selectedItem?.name}</strong>?</p>
                        <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                    </div>
                )

            case 'view':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nombre:</label>
                            <p>{selectedItem?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email:</label>
                            <p>{selectedItem?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Rol:</label>
                            <p>{selectedItem?.role}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Fecha de Creación:</label>
                            <p>{new Date(selectedItem?.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }


    return (
        <AdminLayout>
            <ManagementUsersLayout>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

                    <DataTable
                        columns={columns}
                        data={librarians}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={handleSearch}
                        toolbarActions={
                            <Button onClick={openCreate}>
                                Crear Usuario
                            </Button>
                        }
                    />

                    <CrudModal
                        isOpen={isOpen}
                        onClose={close}
                        operation={operation || 'create'}
                        title={
                            operation === 'create' ? 'Crear Nuevo Usuario' :
                                operation === 'edit' ? 'Editar Usuario' :
                                    operation === 'delete' ? 'Confirmar Eliminación' :
                                        'Ver Usuario'
                        }
                        description={
                            operation === 'delete' ? 'Esta acción no se puede deshacer.' :
                                'undefined'
                        }
                        onSubmit={
                            operation === 'create' ? () => {
                                const form = document.querySelector('form')
                                if (form) form.requestSubmit()
                            } :
                                operation === 'edit' ? () => {
                                    const form = document.querySelector('form')
                                    if (form) form.requestSubmit()
                                } :
                                    operation === 'delete' ? handleDeleteUser :
                                        'undefined'
                        }
                        isLoading={router.processing}
                        showFooter={operation !== 'view'}
                    >
                        {renderModalContent()}
                    </CrudModal>
                </div>
            </ManagementUsersLayout>
        </AdminLayout>
    )
}