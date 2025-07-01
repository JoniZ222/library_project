import React from 'react';
import { CrudModal } from '@/components/ui/crud-modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false,
}) => {
    return (
        <CrudModal
            isOpen={isOpen}
            onClose={onClose}
            operation="delete"
            title={title}
            description={message}
            onSubmit={onConfirm}
            onCancel={onClose}
            isLoading={isLoading}
            submitText="Eliminar"
            cancelText="Cancelar"
        >
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                    <p className="font-medium">¿Estás seguro?</p>
                    <p>Esta acción no se puede deshacer.</p>
                </div>
            </div>
        </CrudModal>
    );
}; 