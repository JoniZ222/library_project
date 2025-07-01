import React, { useState, useEffect } from 'react';
import {
  Author,
  Category,
  Publisher,
  Genre,
} from '@/types/models';
import { Select, SelectOption } from '@/components/selects';
import { MultiSelect } from '@/components/multi-select';
import { FileInput } from '@/components/input-image';
import { useQuickCreate } from '@/hooks/use-quick-create';
import { Label } from '@/components/ui/label';

interface BookFormProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  formTitle: string;
  authors: Author[];
  categories: Category[];
  publishers: Publisher[];
  genres: Genre[];
  existingCoverImage?: string | null;
}

export const BookForm: React.FC<BookFormProps> = ({
  data,
  setData,
  errors,
  onSubmit,
  onCancel,
  isSubmitting,
  formTitle,
  authors: initialAuthors,
  categories: initialCategories,
  publishers: initialPublishers,
  genres: initialGenres,
  existingCoverImage,
}) => {
  const { createCategory, createPublisher, createGenre, createAuthor } = useQuickCreate();

  // Estado local para las opciones
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [publishers, setPublishers] = useState<Publisher[]>(initialPublishers);
  const [genres, setGenres] = useState<Genre[]>(initialGenres);

  // Actualizar opciones cuando cambian las props iniciales
  useEffect(() => {
    setAuthors(initialAuthors);
  }, [initialAuthors]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setPublishers(initialPublishers);
  }, [initialPublishers]);

  useEffect(() => {
    setGenres(initialGenres);
  }, [initialGenres]);

  // Funciones para crear y actualizar opciones
  const handleCreateCategory = async (name: string) => {
    try {
      const newCategory = await createCategory(name);
      setCategories(prev => [...prev, { id: newCategory.id, name: newCategory.name } as Category]);
      return newCategory;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  };

  const handleCreatePublisher = async (name: string) => {
    try {
      const newPublisher = await createPublisher(name);
      setPublishers(prev => [...prev, { id: newPublisher.id, name: newPublisher.name } as Publisher]);
      return newPublisher;
    } catch (error) {
      console.error('Error al crear editorial:', error);
      throw error;
    }
  };

  const handleCreateGenre = async (name: string) => {
    try {
      const newGenre = await createGenre(name);
      setGenres(prev => [...prev, { id: newGenre.id, name: newGenre.name } as Genre]);
      return newGenre;
    } catch (error) {
      console.error('Error al crear género:', error);
      throw error;
    }
  };

  const handleCreateAuthor = async (fullName: string) => {
    try {
      const newAuthor = await createAuthor(fullName);
      setAuthors(prev => [...prev, { id: newAuthor.id, full_name: newAuthor.name } as Author]);
      return newAuthor;
    } catch (error) {
      console.error('Error al crear autor:', error);
      throw error;
    }
  };

  const authorOptions: SelectOption[] = authors.map(a => ({ label: a.full_name, value: a.id }));
  const categoryOptions: SelectOption[] = categories.map(c => ({ label: c.name, value: c.id }));
  const publisherOptions: SelectOption[] = publishers.map(p => ({ label: p.name, value: p.id }));
  const genreOptions: SelectOption[] = genres.map(g => ({ label: g.name, value: g.id }));
  const conditionOptions: SelectOption[] = [
    { label: 'Nuevo', value: 'nuevo' }, { label: 'Usado', value: 'usado' }, { label: 'Deteriorado', value: 'deteriorado' },
  ];
  const statusOptions: SelectOption[] = [
    { label: 'Disponible', value: 'disponible' }, { label: 'Prestado', value: 'prestado' }, { label: 'Reservado', value: 'reservado' },
  ];

  const handleNestedChange = (parentKey: string, childKey: string, value: any) => {
    setData(parentKey, {
      ...data[parentKey],
      [childKey]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6 border rounded-lg shadow-md bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
      <h2 className="text-2xl font-bold border-b pb-2 text-card-foreground dark:text-card-foreground">{formTitle}</h2>

      <fieldset className="border p-4 rounded-md border-border dark:border-border bg-popover dark:bg-popover">
        <legend className="px-2 font-semibold text-card-foreground dark:text-card-foreground">Información Principal</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-card-foreground dark:text-card-foreground">Título</label>
            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input" />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div>
            <label className="text-card-foreground dark:text-card-foreground">ISBN</label>
            <input type="text" value={data.isbn} onChange={e => setData('isbn', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input" />
            {errors.isbn && <div className="text-red-500 text-sm mt-1">{errors.isbn}</div>}
          </div>
          <div>
            <label className="text-card-foreground dark:text-card-foreground">Folio</label>
            <input type="text" value={data.folio} onChange={e => setData('folio', e.target.value)} className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input" />
            {errors.folio && <div className="text-red-500 text-sm mt-1">{errors.folio}</div>}
          </div>
          <div>
            <label className="text-card-foreground dark:text-card-foreground">Año de Publicación</label>
            <input
              type="number"
              value={data.publication_year}
              onChange={e => setData('publication_year', e.target.value)}
              className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              min="1800"
              max={new Date().getFullYear() + 1}
            />
            {errors.publication_year && <div className="text-red-500 text-sm mt-1">{errors.publication_year}</div>}
          </div>
          <div className="md:col-span-2">
            <label className="text-card-foreground dark:text-card-foreground">Descripción</label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input resize-none"
              rows={3}
              style={{ overflow: 'hidden' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
          </div>
          <div>
            <FileInput
              label="Imagen de Portada"
              accept="image/*"
              multiple={false}
              value={data.cover_image ? [data.cover_image] : []}
              onChange={files => {
                if (files && files.length > 0) {
                  setData('cover_image', files[0]);
                } else {
                  setData('cover_image', null);
                }
              }}
              preview={true}
            />
            {existingCoverImage && !data.cover_image && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-card-foreground dark:text-card-foreground mb-1">
                  Imagen Actual
                </label>
                <img
                  src={existingCoverImage}
                  alt="Portada actual"
                  className="w-20 h-20 object-cover rounded border border-input dark:border-input bg-white dark:bg-background"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Selecciona una nueva imagen para reemplazar la actual
                </p>
              </div>
            )}
            {errors.cover_image && <div className="text-red-500 text-sm mt-1">{errors.cover_image}</div>}
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-4 rounded-md border-border dark:border-border bg-popover dark:bg-popover">
        <legend className="px-2 font-semibold text-card-foreground dark:text-card-foreground">Clasificación y Autores</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="category_id"
              className="text-card-foreground dark:text-card-foreground"
            >
              Categoría
            </Label>
          <Select
            options={categoryOptions}
            value={data.category_id}
            onChange={(value) => setData('category_id', value)}
            placeholder={categories.length === 0 ? "No hay categorías disponibles debes crear una en la sección de categorías" : "Selecciona una categoría..."}
            allowCreate={true}
            createText="Agregar categoría"
              onCreateNew={handleCreateCategory}
              entityName="categoría"
            />
          </div>
          <div>
            <Label
              htmlFor="publisher_id"
              className="text-card-foreground dark:text-card-foreground"
            />
              Editorial
          <Select
            options={publisherOptions}
            value={data.publisher_id}
            onChange={(value) => setData('publisher_id', value)}
            placeholder={publishers.length === 0 ? "No hay editoriales disponibles debes crear una en la sección de editoriales" : "Selecciona una editorial..."}
            allowCreate={true}
            createText="Agregar editorial"
            onCreateNew={handleCreatePublisher}
            entityName="editorial"
          />
          </div>
          <div>
            <Label
              htmlFor="genre_id"
              className="text-card-foreground dark:text-card-foreground"
            />
              Género    
          <Select
            options={genreOptions}
            value={data.genre_id}
            onChange={(value) => setData('genre_id', value)}
            placeholder={genres.length === 0 ? "No hay géneros disponibles debes crear uno en la sección de géneros" : "Selecciona un género..."}
            allowCreate={true}
            createText="Agregar género"
            onCreateNew={handleCreateGenre}
            entityName="género"
          />
          </div>
          <div>
            <Label
              htmlFor="authors"
              className="text-card-foreground dark:text-card-foreground"
            >
              Autores
            </Label>
          <div className="md:col-span-2">
            <MultiSelect
              options={authorOptions}
              values={data.authors}
              onChange={(values) => setData('authors', values)}
              placeholder={authors.length === 0 ? "No hay autores disponibles debes crear uno en la sección de autores" : "Selecciona uno o varios autores..."}
              allowCreate={true}
              createText="Agregar autor"
              onCreateNew={handleCreateAuthor}
              entityName="autor"
            />
            </div>
            {errors.authors && <div className="text-red-500 text-sm mt-1">{errors.authors}</div>}
          </div>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset className="border p-4 rounded-md border-border dark:border-border bg-popover dark:bg-popover">
          <legend className="px-2 font-semibold text-card-foreground dark:text-card-foreground">Detalles Adicionales</legend>
          <div className="space-y-4">
            <div>
              <label className="text-card-foreground dark:text-card-foreground">Idioma</label>
              <input
                type="text"
                value={data.book_details.language}
                onChange={e => handleNestedChange('book_details', 'language', e.target.value)}
                className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              />
              {errors['book_details.language'] && <div className="text-red-500 text-sm mt-1">{errors['book_details.language']}</div>}
            </div>
            <div>
              <label className="text-card-foreground dark:text-card-foreground">Páginas</label>
              <input
                type="number"
                value={data.book_details.pages}
                onChange={e => handleNestedChange('book_details', 'pages', e.target.value)}
                className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              />
              {errors['book_details.pages'] && <div className="text-red-500 text-sm mt-1">{errors['book_details.pages']}</div>}
            </div>
            <div>
              <label className="text-card-foreground dark:text-card-foreground">Edición</label>
              <input
                type="text"
                value={data.book_details.edition}
                onChange={e => handleNestedChange('book_details', 'edition', e.target.value)}
                className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              />
              {errors['book_details.edition'] && <div className="text-red-500 text-sm mt-1">{errors['book_details.edition']}</div>}
            </div>
            <div>
              <label className="text-card-foreground dark:text-card-foreground">ISBN-13</label>
              <input
                type="text"
                value={data.book_details.isbn13}
                onChange={e => handleNestedChange('book_details', 'isbn13', e.target.value)}
                className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              />
              {errors['book_details.isbn13'] && <div className="text-red-500 text-sm mt-1">{errors['book_details.isbn13']}</div>}
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md border-border dark:border-border bg-popover dark:bg-popover">
          <legend className="px-2 font-semibold text-card-foreground dark:text-card-foreground">Inventario</legend>
          <div className="space-y-4">
            <div>
              <label className="text-card-foreground dark:text-card-foreground">Cantidad</label>
              <input
                type="number"
                value={data.inventory.quantity}
                onChange={e => handleNestedChange('inventory', 'quantity', Number(e.target.value))}
                className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              />
            </div>
            {errors['inventory.quantity'] && <div className="text-red-500 text-sm mt-1">{errors['inventory.quantity']}</div>}
            <div>
              <Select
                options={conditionOptions}
                value={data.inventory.condition}
                onChange={v => handleNestedChange('inventory', 'condition', v)}
                placeholder="Condición"
              />
              {errors['inventory.condition'] && <div className="text-red-500 text-sm mt-1">{errors['inventory.condition']}</div>}
            </div>
            <div>
              <Select
                options={statusOptions}
                value={data.inventory.status}
                onChange={v => handleNestedChange('inventory', 'status', v)}
                placeholder="Estado"
              />
              {errors['inventory.status'] && <div className="text-red-500 text-sm mt-1">{errors['inventory.status']}</div>}
            </div>
            <div>
              <label className="text-card-foreground dark:text-card-foreground">Ubicación</label>
              <input
                type="text"
                value={data.inventory.location}
                onChange={e => handleNestedChange('inventory', 'location', e.target.value)}
                className="w-full border rounded p-2 bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input"
              />
              {errors['inventory.location'] && <div className="text-red-500 text-sm mt-1">{errors['inventory.location']}</div>}
            </div>
          </div>
        </fieldset>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded border-border dark:border-border bg-muted dark:bg-muted text-foreground dark:text-foreground" disabled={isSubmitting}>Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Libro'}</button>
      </div>
    </form>
  );
};