import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { BookForm } from '@/components/forms/book-form';
import { Author, Category, Publisher, Genre } from '@/types/models';
import LibrarianLayout from '@/layouts/librarian-layout';
import ManagementBooksLayout from '@/layouts/librarian/management-books';

interface CreatePageProps {
    authors: Author[];
    categories: Category[];
    publishers: Publisher[];
    genres: Genre[];
}

const CreateBookPage = ({ authors, categories, publishers, genres }: CreatePageProps) => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        isbn: '',
        folio: '',
        description: '',
        publication_year: '',
        category_id: null,
        publisher_id: null,
        genre_id: null,
        authors: [],
        cover_image: null,
        book_details: { language: '', pages: '', edition: '', isbn13: '' },
        inventory: { quantity: 0, condition: null, location: '', status: null },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('librarian.books.store'));
    };

    return (
        <LibrarianLayout>
            <ManagementBooksLayout>
                <Head title="Crear Libro" />
                <BookForm
                    formTitle="Crear Nuevo Libro"
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
                />
            </ManagementBooksLayout>
        </LibrarianLayout>
    );
};

export default CreateBookPage;