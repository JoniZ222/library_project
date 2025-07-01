import React from 'react'
import { useForm } from '@inertiajs/react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Librarian {
    id?: number
    name: string
    email: string
    role: string
    matricula?: string
    especialidad?: string
}

interface LibrarianFormProps {
    librarian?: Librarian
    onSubmit: (data: Librarian) => void
    isLoading?: boolean
    isCreate?: boolean
}

export function LibrarianForm({ librarian, onSubmit, isLoading, isCreate = false }: LibrarianFormProps) {
    const { data, setData, errors, processing } = useForm({
        name: librarian?.name || '',
        email: librarian?.email || '',
        role: librarian?.role || 'librarian',
        matricula: librarian?.matricula || '',
        especialidad: librarian?.especialidad || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Si es creación, mostrar solo el campo matrícula */}
            {isCreate ? (
                <div className="space-y-2">
                    <Label htmlFor="matricula">Matrícula del Bibliotecario</Label>
                    <Input
                        id="matricula"
                        value={data.matricula}
                        onChange={(e) => setData('matricula', e.target.value)}
                        placeholder="Ingresa la matrícula del bibliotecario"
                        disabled={isLoading}
                        autoFocus
                    />
                    {errors.matricula && (
                        <p className="text-sm text-red-500">{errors.matricula}</p>
                    )}
                </div>
            ) : (
                /* Si es edición, mostrar todos los campos */
                <>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ingresa el nombre"
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Ingresa el email"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="especialidad">Especialidad</Label>
                        <Select
                            value={data.especialidad}
                            onValueChange={(value) => setData('especialidad', value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una especialidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">Bibliotecario General</SelectItem>
                                <SelectItem value="digital">Bibliotecario Digital</SelectItem>
                                <SelectItem value="archivo">Archivista</SelectItem>
                                <SelectItem value="catalogacion">Catalogación</SelectItem>
                                <SelectItem value="referencia">Referencia</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.especialidad && (
                            <p className="text-sm text-red-500">{errors.especialidad}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="librarian">Bibliotecario</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-red-500">{errors.role}</p>
                        )}
                    </div>
                </>
            )}

            <button type="submit" className="hidden" />
        </form>
    )
}