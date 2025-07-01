import React from "react";
import { FileInput } from "@/components/input-image";
import { Publisher } from "@/types/models";

interface PublisherFormProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    formTitle: string;
    existingImage?: string | null;
}

export const PublisherForm: React.FC<PublisherFormProps> = ({
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
                            Nombre de la Editorial *
                        </label>
                        <input
                            type="text"
                            value={data.name || ''}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                            placeholder="Nombre de la editorial"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={data.address || ''}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                            placeholder="Dirección de la editorial"
                        />
                        {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={data.phone || ''}
                            onChange={e => setData('phone', e.target.value)}
                            className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                            placeholder="Teléfono de contacto"
                        />
                        {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email || ''}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                            placeholder="Email de contacto"
                        />
                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                            Sitio Web
                        </label>
                        <input
                            type="url"
                            value={data.website || ''}
                            onChange={e => setData('website', e.target.value)}
                            className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
                            placeholder="https://www.ejemplo.com"
                        />
                        {errors.website && <div className="text-red-500 text-sm mt-1">{errors.website}</div>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <FileInput
                            label="Logo de la Editorial"
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
                                    Logo Actual
                                </label>
                                <img
                                    src={existingImage}
                                    alt="Logo actual de la editorial"
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
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="px-4 py-2 border rounded border-border dark:border-border bg-muted dark:bg-muted text-foreground dark:text-foreground" 
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Editorial'}
                </button>
            </div>
        </form>
    );
}