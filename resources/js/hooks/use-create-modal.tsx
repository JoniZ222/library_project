import { useState } from 'react'

type CrudOperation = 'create' | 'edit' | 'delete' | 'view'

interface UseCrudModalReturn {
    isOpen: boolean
    operation: CrudOperation | null
    selectedItem: any | null
    openCreate: () => void
    openEdit: (item: any) => void
    openDelete: (item: any) => void
    openView: (item: any) => void
    close: () => void
}

export function useCrudModal(): UseCrudModalReturn {
    const [isOpen, setIsOpen] = useState(false)
    const [operation, setOperation] = useState<CrudOperation | null>(null)
    const [selectedItem, setSelectedItem] = useState<any | null>(null)

    const openCreate = () => {
        setOperation('create')
        setSelectedItem(null)
        setIsOpen(true)
    }

    const openEdit = (item: any) => {
        setOperation('edit')
        setSelectedItem(item)
        setIsOpen(true)
    }

    const openDelete = (item: any) => {
        setOperation('delete')
        setSelectedItem(item)
        setIsOpen(true)
    }

    const openView = (item: any) => {
        setOperation('view')
        setSelectedItem(item)
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setOperation(null)
        setSelectedItem(null)
    }

    return {
        isOpen,
        operation,
        selectedItem,
        openCreate,
        openEdit,
        openDelete,
        openView,
        close,
    }
}