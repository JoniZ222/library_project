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

interface User {
    id?: number
    name: string
    email: string
    role: string
    matricula?: string // Agregamos el campo matrícula
}

interface UserFormProps {
    user?: User
    onSubmit: (data: User) => void
    isLoading?: boolean
    isCreate?: boolean // Para diferenciar entre crear y editar
}

export function UserForm({ user, onSubmit, isLoading, isCreate = false }: UserFormProps) {
    const { data, setData, errors, processing } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'user',
        matricula: user?.matricula || '', // Campo matrícula
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
                    <Label htmlFor="matricula">Matrícula</Label>
                    <Input
                        id="matricula"
                        value={data.matricula}
                        onChange={(e) => setData('matricula', e.target.value)}
                        placeholder="Ingresa la matrícula"
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
                                <SelectItem value="user">Usuario</SelectItem>
                                <SelectItem value="librarian">Bibliotecario</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="superadmin">Super Administrador</SelectItem>
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