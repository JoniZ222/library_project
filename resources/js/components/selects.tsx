import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    options: SelectOption[];
    value?: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    noOptionsText?: string;
    notFoundText?: string;
    allowClear?: boolean;
    allowCreate?: boolean;
    createText?: string;
    onCreateNew?: (label: string) => Promise<{ id: number; name: string }>;
    entityName?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Selecciona una opción...',
    noOptionsText = 'No hay opciones disponibles',
    notFoundText = 'No se encontraron resultados',
    allowClear = false,
    allowCreate = false,
    createText = 'Agregar nuevo',
    onCreateNew,
    entityName = 'elemento',
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlighted, setHighlighted] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Modificado: Permitir crear cuando no hay resultados en filtros o cuando no hay opciones
    const showCreateOption = allowCreate && (
        (search.trim() && filteredOptions.length === 0) ||
        (options.length === 0 && search.trim())
    );

    useEffect(() => {
        if (!open) setSearch('');
        if (open) setHighlighted(0);
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        
        const totalOptions = filteredOptions.length + (showCreateOption ? 1 : 0);
        
        if (e.key === 'ArrowDown') {
            setHighlighted(h => Math.min(h + 1, totalOptions - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setHighlighted(h => Math.max(h - 1, 0));
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (showCreateOption && highlighted === filteredOptions.length) {
                handleCreateNew();
            } else if (filteredOptions[highlighted]) {
                onChange(filteredOptions[highlighted].value);
                setOpen(false);
            }
            e.preventDefault();
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    const handleCreateNew = async () => {
        if (!onCreateNew || !search.trim()) return;
        
        setIsCreating(true);
        try {
            const newItem = await onCreateNew(search.trim());
            // Agregar el nuevo elemento a las opciones y seleccionarlo
            const newOption = { label: newItem.name, value: newItem.id };
            onChange(newItem.id);
            setOpen(false);
            setSearch('');
        } catch (error) {
            console.error('Error al crear nuevo elemento:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div ref={ref} tabIndex={0} className="relative w-full" onKeyDown={handleKeyDown}>
            <div
                className="border border-input dark:border-input rounded px-3 py-2 flex items-center cursor-pointer bg-white dark:bg-background text-gray-800 dark:text-foreground"
                onClick={() => setOpen(o => !o)}
            >
                <span className="flex-1 truncate">
                    {options.find(opt => opt.value === value)?.label || placeholder}
                </span>
                {allowClear && value !== null && value !== 'undefined' && (
                    <button
                        className="ml-2 text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        onClick={e => {
                            e.stopPropagation();
                            onChange(null);
                        }}
                        tabIndex={-1}
                    >
                        ×
                    </button>
                )}
                <span className="ml-2 text-gray-400 dark:text-gray-400">▼</span>
            </div>
            {open && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-background border border-input dark:border-input rounded shadow-lg max-h-60 overflow-auto">
                    <input
                        className="w-full px-3 py-2 border-b border-input dark:border-input outline-none bg-white dark:bg-background text-gray-800 dark:text-foreground"
                        placeholder="Buscar..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                        onKeyDown={e => e.stopPropagation()}
                    />
                    {options.length === 0 ? (
                        <div className="p-2 text-gray-500 dark:text-gray-400">
                            {allowCreate ? (
                                <div className="text-center">
                                    <p className="mb-2">No hay opciones disponibles</p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Para poder crear una nueva {entityName}, debes agregarla en la sección de {entityName}</p>
                                </div>
                            ) : (
                                noOptionsText
                            )}
                        </div>
                    ) : filteredOptions.length === 0 && !showCreateOption ? (
                        <div className="p-2 text-gray-500 dark:text-gray-400">
                            {allowCreate ? (
                                <div className="text-center">
                                    <p className="mb-2">{notFoundText}</p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Para poder crear una nueva {entityName}, debes agregarla en la sección de {entityName}</p>
                                </div>
                            ) : (
                                notFoundText
                            )}
                        </div>
                    ) : (
                        <>
                            {filteredOptions.map((opt, idx) => (
                                <div
                                    key={opt.value}
                                    className={`px-3 py-2 cursor-pointer ${idx === highlighted ? 'bg-blue-100 dark:bg-blue-900' : ''} dark:text-foreground`}
                                    onMouseEnter={() => setHighlighted(idx)}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                            {showCreateOption && (
                                <div
                                    className={`px-3 py-2 cursor-pointer border-t border-input dark:border-input ${
                                        highlighted === filteredOptions.length ? 'bg-green-100 dark:bg-green-900' : 'bg-green-50 dark:bg-green-950/20'
                                    } text-green-700 dark:text-green-300`}
                                    onMouseEnter={() => setHighlighted(filteredOptions.length)}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        handleCreateNew();
                                    }}
                                >
                                    {isCreating ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                            <span>Creando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">+</span>
                                            <span>{createText}: "{search}"</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
