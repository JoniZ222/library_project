import axios from 'axios';

export const useQuickCreate = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const createCategory = async (name: string): Promise<{ id: number; name: string }> => {
        try {
            const response = await axios.post(
                route('librarian.quick-create.category'),
                { name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Error al crear la categoría'
            );
        }
    };

    const createPublisher = async (name: string): Promise<{ id: number; name: string }> => {
        try {
            const response = await axios.post(
                route('librarian.quick-create.publisher'),
                { name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Error al crear la editorial'
            );
        }
    };

    const createGenre = async (name: string): Promise<{ id: number; name: string }> => {
        try {
            const response = await axios.post(
                route('librarian.quick-create.genre'),
                { name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Error al crear el género'
            );
        }
    };

    const createAuthor = async (fullName: string): Promise<{ id: number; name: string }> => {
        try {
            const response = await axios.post(
                route('librarian.quick-create.author'),
                { full_name: fullName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Error al crear el autor'
            );
        }
    };

    return {
        createCategory,
        createPublisher,
        createGenre,
        createAuthor,
    };
};