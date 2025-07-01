import axios from "axios";

export const markAsCollected = async (id: string) => {
    const response = await axios.post(route('librarian.books.reservations.mark-as-collected', id), {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    });
    return response.data;
};

export const markAsNotCollected = async (id: string) => {
    const response = await axios.post(route('librarian.books.reservations.mark-as-not-collected', id), {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    });
    return response.data;
};

export const destroy = async (id: string) => {
    const response = await axios.delete(route('librarian.books.reservations.destroy', id), {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    });
    return response.data;
};