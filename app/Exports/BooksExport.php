<?php

namespace App\Exports;

use App\Models\Book;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

/**
 * Clase para exportar datos de libros a Excel/CSV
 * 
 * Esta clase implementa las interfaces FromCollection y WithHeadings de Maatwebsite Excel
 * para permitir la exportación de datos de libros en formatos de hoja de cálculo.
 * 
 * FromCollection: Define qué datos se van a exportar
 * WithHeadings: Define los encabezados de las columnas
 */
class BooksExport implements FromCollection, WithHeadings
{
    /**
     * Obtiene la colección de libros para exportar
     * 
     * Este método carga todos los libros con sus relaciones y los transforma
     * en un formato adecuado para la exportación a Excel/CSV.
     * 
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Cargar todos los libros con sus relaciones (autores, categoría, etc.)
        return Book::withAllRelations()
            ->get()
            ->map(function ($book) {
                // Transformar cada libro en un array con los datos necesarios para la exportación
                return [
                    'title' => $book->title, // Título del libro
                    'authors' => $book->authors->pluck('full_name')->implode(', '), // Nombres de autores separados por comas
                    'category' => $book->category->name ?? 'Sin categoría', // Nombre de la categoría o valor por defecto
                    'status' => $book->isAvailable() ? 'Disponible' : 'No disponible', // Estado de disponibilidad del libro
                    'folio' => $book->folio, // Número de folio del libro
                ];
            });
    }


    public function headings(): array
    {
        return [
            'Título',
            'Autores',
            'Categoría',
            'Estado',
            'Folio',
        ];
    }
}
