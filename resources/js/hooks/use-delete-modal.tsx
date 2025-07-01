import { useState } from 'react';
import { router } from '@inertiajs/react';
import { AlertState } from '@/types/models';

interface DeleteModalState<T> {
    isOpen: boolean;
    item: T | null;
    isLoading: boolean;
}

interface UseDeleteModalOptions<T> {
    onSuccess?: (item: T) => void;
    onError?: (errors: any) => void;
    successMessage?: (item: T) => string;
    errorMessage?: string;
}

interface WithId {
    id: number;
}

export function useDeleteModal<T extends WithId>(
    deleteRoute: (id: number) => string,
    options: UseDeleteModalOptions<T> = {}
) {
    const [deleteModal, setDeleteModal] = useState<DeleteModalState<T>>({
        isOpen: false,
        item: null,
        isLoading: false,
    });

    const [alert, setAlert] = useState<AlertState>({
        isVisible: false,
        message: '',
        type: 'success',
    });

    const handleDeleteClick = (item: T) => {
        setDeleteModal({
            isOpen: true,
            item,
            isLoading: false,
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteModal.item) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        router.delete(deleteRoute(deleteModal.item.id), {
            onSuccess: () => {
                const item = deleteModal.item!;
                setDeleteModal({ isOpen: false, item: null, isLoading: false });
                setAlert({
                    isVisible: true,
                    message: options.successMessage?.(item) || 'Elemento eliminado exitosamente.',
                    type: 'success',
                });
                options.onSuccess?.(item);
            },
            onError: (errors) => {
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
                setAlert({
                    isVisible: true,
                    message: errors.message || options.errorMessage || 'Error al eliminar. Por favor, inténtalo de nuevo.',
                    type: 'error',
                });
                options.onError?.(errors);
            },
        });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
    };

    const handleAlertClose = () => {
        setAlert({ isVisible: false, message: '', type: 'success' });
    };

    return {
        deleteModal,
        alert,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleAlertClose,
    };
} 