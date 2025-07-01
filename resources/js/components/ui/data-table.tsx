import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PaginatedResponse } from "@/types/models"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: PaginatedResponse<TData>
    isLoading?: boolean
    initialSearchValue?: string
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: string) => void
    onSearch: (query: string) => void
    toolbarActions?: React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    initialSearchValue,
    onPageChange,
    onPerPageChange,
    onSearch,
    toolbarActions,
}: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data: data.data ?? [],
        columns,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount: data.last_page ?? -1,
        rowCount: data.total,
        getCoreRowModel: getCoreRowModel(),
    })

    const [searchValue, setSearchValue] = React.useState(initialSearchValue || '');

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(searchValue);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Buscar en la tabla..."
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                </div>
                {toolbarActions}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: data.per_page }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={columns.length} className="h-12 text-center">
                                        Cargando...
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Mostrando {data.from ?? 0} a {data.to ?? 0} de {data.total ?? 0} registros.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Filas por página</p>
                        <Select
                            value={`${data.per_page}`}
                            onValueChange={(value) => onPerPageChange(value)}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={data.per_page} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Página {data.current_page} de {data.last_page}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => onPageChange(1)}
                            disabled={data.current_page === 1}
                        >
                            <span className="sr-only">Ir a la primera página</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(data.current_page - 1)}
                            disabled={data.current_page === 1}
                        >
                            <span className="sr-only">Ir a la página anterior</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(data.current_page + 1)}
                            disabled={data.current_page === data.last_page}
                        >
                            <span className="sr-only">Ir a la siguiente página</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => onPageChange(data.last_page)}
                            disabled={data.current_page === data.last_page}
                        >
                            <span className="sr-only">Ir a la última página</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}