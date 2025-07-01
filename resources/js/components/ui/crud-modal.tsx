import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type CrudOperation = 'create' | 'edit' | 'delete' | 'view';

interface CrudModalProps {
    isOpen: boolean
    onClose: () => void
    operation: CrudOperation
    title: string
    description?: string
    children: React.ReactNode
    onSubmit?: () => void
    onCancel?: () => void
    isLoading?: boolean
    submitText?: string
    cancelText?: string
    showFooter?: boolean
}

export function CrudModal({
    isOpen,
    onClose,
    operation,
    title,
    description,
    children,
    onSubmit,
    onCancel,
    isLoading = false,
    submitText,
    cancelText = "Cancelar",
    showFooter = true,
}: CrudModalProps) {
    const getDefaultSubmitText = () => {
        switch (operation) {
            case 'create': return 'Crear'
            case 'edit': return 'Guardar'
            case 'delete': return 'Eliminar'
            case 'view': return 'Cerrar'
            default: return 'Confirmar'
        }
    }

    const getDefaultTitle = () => {
        switch (operation) {
            case 'create': return 'Crear Nuevo'
            case 'edit': return 'Editar'
            case 'delete': return 'Confirmar Eliminación'
            case 'view': return 'Ver Detalles'
            default: return title
        }
    }

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit()
        }
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{getDefaultTitle()}</DialogTitle>
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-4">
                    {children}
                </div>

                {showFooter && (
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>

                        {operation !== 'view' && (
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                variant={operation === 'delete' ? 'destructive' : 'default'}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {submitText || getDefaultSubmitText()}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}