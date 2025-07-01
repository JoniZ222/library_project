import React from "react";
import { FileInput } from "@/components/input-image";
import { Genre } from "@/types/models";

interface GenreFormProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    formTitle: string;
    existingImage?: string | null;
}

export const GenreForm: React.FC<GenreFormProps> = ({
    data,
    setData,
    errors,
    onSubmit,
    onCancel,
    isSubmitting,
    formTitle,
    existingImage,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6 p-6 border rounded-lg shadow-md bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
            <h2 className="text-2xl font-bold border-b pb-2 text-card-foreground dark:text-card-foreground">{formTitle}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                            Nombre del Género *
                        </label>
                        <input type="text" value={data.name || ''} onChange={e => setData('name', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input" placeholder="Nombre del género" />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                            Descripción
                        </label>
                        <textarea value={data.description || ''} onChange={e => setData('description', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input resize-none" rows={4} placeholder="Descripción del género" style={{ overflow: 'hidden' }} onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }} />
                        {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <FileInput
                            label="Imagen del Género"
                            accept="image/*"
                            multiple={false}
                            value={data.image ? [data.image] : []}
                            onChange={files => {
                                if (files && files.length > 0) {
                                    setData('image', files[0]);
                                } else {
                                    setData('image', null);
                                }
                            }}
                            preview={true}
                        />
                        {existingImage && !data.image && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                                    Imagen Actual
                                </label>
                                <img
                                    src={existingImage}
                                    alt="Imagen actual del género"
                                    className="w-32 h-32 object-cover rounded border border-input dark:border-input bg-white dark:bg-background"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Selecciona una nueva imagen para reemplazar la actual
                                </p>
                            </div>
                        )}
                        {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded border-border dark:border-border bg-muted dark:bg-muted text-foreground dark:text-foreground" disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Género'}
                </button>
            </div>
        </form>
    );
}