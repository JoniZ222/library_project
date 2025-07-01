import { router } from "@inertiajs/react";

interface TableFilters {
    search?: string; // para consultas manuales
    perPage: number;
    page?: number;
    filter?: Record<string, any>; // para QueryBuilder
    [key: string]: any;
}

export function useSmartTableNavigation(
    filters: TableFilters,
    {
        routeName,
        preserveState = true,
        replace = true
    }: {
        routeName: string;
        preserveState?: boolean;
        replace?: boolean;
    }
) {
    const navigate = (newParams: Partial<TableFilters>) => {
        const merged = {
            ...filters,
            ...newParams,
            filter: {
                ...(filters.filter || {}),
                ...(newParams.filter || {}),
            },
        };

        router.post(route(routeName), merged, {
            preserveState,
            replace,
        });
    };

    const handlePageChange = (page: number) => navigate({ page });

    const handlePerPageChange = (perPage: number | string) =>
        navigate({ perPage: Number(perPage), page: 1 });

    const handleSearch = (query: string, mode: 'querybuilder' | 'manual' = 'manual') => {
        if (mode === 'querybuilder') {
            navigate({
                filter: { title: query }, // puedes parametrizar esto
                page: 1,
            });
        } else {
            navigate({
                search: query,
                page: 1,
            });
        }
    };

    const handleFilterChange = (key: string, value: any) =>
        navigate({ filter: { [key]: value }, page: 1 });

    const resetFilters = () => {
        const reset = {
            search: '',
            filter: {},
            page: 1,
            perPage: 10,
        };

        router.post(route(routeName), reset, {
            preserveState,
            replace,
        });
    };

    return {
        handlePageChange,
        handlePerPageChange,
        handleSearch,
        handleFilterChange,
        resetFilters,
        navigate,
    };
}
