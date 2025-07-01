import { Book } from "@/types/models";
import React, { useState } from "react";

interface InventoryFormProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    formTitle: string;
    isSubmitting?: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ data, setData, errors, onSubmit, onCancel, formTitle, isSubmitting }) => {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">{formTitle}</h1>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="quantity" className="block text-sm font-medium text-card-foreground dark:text-card-foreground">Cantidad</label>
                    <input type="number" id="quantity" value={data.quantity} onChange={e => setData('quantity', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="condition" className="block text-sm font-medium text-card-foreground dark:text-card-foreground">Condición</label>
                    <select id="condition" value={data.condition} onChange={e => setData('condition', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                        <option value="nuevo">Nuevo</option>
                        <option value="usado">Usado</option>
                        <option value="deteriorado">Deteriorado</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-card-foreground dark:text-card-foreground">Ubicación</label>
                    <input type="text" id="location" value={data.location} onChange={e => setData('location', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-card-foreground dark:text-card-foreground">Estado</label>
                    <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input">
                        <option value="disponible">Disponible</option>
                        <option value="prestado">Prestado</option>
                        <option value="reservado">Reservado</option>
                        <option value="perdido">Perdido</option>
                        <option value="danado">Danado</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-card-foreground dark:text-card-foreground">Notas</label>
                    <textarea id="notes" value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input resize-none" rows={4} placeholder="Notas del inventario" style={{ overflow: 'hidden' }} onInput={e => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }} />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded border-border dark:border-border bg-muted dark:bg-muted text-foreground dark:text-foreground" disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Inventario'}
                </button>
            </div>
        </form>
    );
}