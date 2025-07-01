import React, { useEffect } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import { BookForm } from '@/components/forms/book-form';
import { Book, Author, Category, Publisher, Genre } from '@/types/models';
import LibrarianLayout from '@/layouts/librarian-layout';
import ManagementBooksLayout from '@/layouts/librarian/management-books';

interface EditPageProps {
    book: Book;
    authors: Author[];
    categories: Category[];
    publishers: Publisher[];
    genres: Genre[];
    storageUrl: string;
}

const EditBookPage = ({ book, authors, categories, publishers, genres, storageUrl }: EditPageProps) => {
    const { data, setData, put, processing, errors } = useForm({
        title: book.title || '',
        isbn: book.isbn || '',
        folio: book.folio || '',
        description: book.description || '',
        publication_year: book.publication_year?.toString() || '',
        category_id: book.category_id || null,
        publisher_id: book.publisher_id || null,
        genre_id: book.genre_id || null,
        authors: book.authors?.map(author => author.id) || [],
        cover_image: null,
        book_details: {
            language: book.book_details?.language || '',
            pages: book.book_details?.pages || '',
            edition: book.book_details?.edition || '',
            isbn13: book.book_details?.isbn13 || ''
        },
        inventory: {
            quantity: book.inventory?.quantity || 0,
            condition: book.inventory?.condition || null,
            location: book.inventory?.location || '',
            status: book.inventory?.status || null
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Si hay una imagen, usar FormData para evitar problemas con datos anidados
        if (data.cover_image && typeof data.cover_image === 'object' && 'name' in data.cover_image) {
            const formData = new FormData();
            formData.append('_method', 'PUT');

            // Datos básicos
            formData.append('title', data.title);
            formData.append('isbn', data.isbn);
            formData.append('description', data.description || '');
            formData.append('cover_image', data.cover_image);

            if (data.publication_year) {
                formData.append('publication_year', data.publication_year);
            }
            if (data.category_id) {
                formData.append('category_id', data.category_id.toString());
            }
            if (data.publisher_id) {
                formData.append('publisher_id', data.publisher_id.toString());
            }
            if (data.genre_id) {
                formData.append('genre_id', data.genre_id.toString());
            }

            // Autores
            if (data.authors && data.authors.length > 0) {
                data.authors.forEach(authorId => {
                    formData.append('authors[]', authorId.toString());
                });
            }

            // Detalles del libro
            if (data.book_details) {
                Object.entries(data.book_details).forEach(([key, value]) => {
                    if (value !== null && value !== '') {
                        formData.append(`book_details[${key}]`, value.toString());
                    }
                });
            }

            // Inventario
            if (data.inventory) {
                Object.entries(data.inventory).forEach(([key, value]) => {
                    if (value !== null && value !== '') {
                        formData.append(`inventory[${key}]`, value.toString());
                    }
                });
            }

            // Usar router.post con FormData
            router.post(route('librarian.books.update', book.id), formData, {
                forceFormData: true,
            });
        } else {
            // Si no hay imagen, usar el método normal
            put(route('librarian.books.update', book.id));
        }
    };

    return (
        <LibrarianLayout>
            <ManagementBooksLayout>
                <Head title="Editar Libro" />
                <BookForm
                    formTitle="Editar Libro"
                    data={data}
                    setData={setData}
                    errors={errors}
                    onSubmit={handleSubmit}
                    onCancel={() => window.history.back()}
                    isSubmitting={processing}
                    authors={authors}
                    categories={categories}
                    publishers={publishers}
                    genres={genres}
                    existingCoverImage={storageUrl + '/' + book.cover_image}
                />
            </ManagementBooksLayout>
        </LibrarianLayout>
    );
};

export default EditBookPage;