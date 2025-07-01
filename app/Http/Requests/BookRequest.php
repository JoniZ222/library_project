<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class BookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && in_array(Auth::user()->role, ['librarian', 'admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        $rules = [
            'title'                 => 'required|string|max:255',
            'isbn'                  => 'required|string|max:50',
            'folio'                 => 'required|string|max:50',
            'publication_year'      => 'required|integer|min:1200|max:' . date('Y'),
            'cover_image'           => $this->isMethod('post') ? 'nullable|image|mimes:webp,jpeg,png,jpg,gif,svg|max:2048' : 'nullable|string',
            'description'           => 'nullable|string|max:1000',
            'category_id'           => 'nullable|exists:categories,id',
            'publisher_id'          => 'nullable|exists:publishers,id',
            'genre_id'              => 'nullable|exists:genres,id',
            'authors'               => 'nullable|array',
            'authors.*'             => 'nullable|exists:authors,id',
            'book_details'          => 'nullable|array',
            'inventory'             => 'nullable|array',
        ];
        if ($this->isMethod('post')) {
            $rules['isbn'] .= '|unique:books,isbn';
            $rules['folio'] .= '|unique:books,folio';
        } else {
            $rules['isbn'] .= '|unique:books,isbn,' . $this->id;
            $rules['folio'] .= '|unique:books,folio,' . $this->id;
        }
        $rules['book_details.language'] = 'nullable|string|max:50';
        $rules['book_details.pages'] = 'nullable|string|max:10';
        $rules['book_details.edition'] = 'nullable|string|max:50';
        $rules['book_details.isbn13'] = 'nullable|string|max:20';

        $rules['inventory.quantity'] = 'nullable|integer|min:0';
        $rules['inventory.condition'] = 'nullable|string|in:nuevo,usado,deteriorado';
        $rules['inventory.status'] = 'nullable|string|in:disponible,prestado,reservado';
        $rules['inventory.location'] = 'nullable|string|max:255';

        return $rules;
    }

    public function messages()
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'isbn.required' => 'El ISBN es obligatorio.',
            'isbn.max' => 'El ISBN no puede tener más de 50 caracteres.',
            'isbn.unique' => 'El ISBN ya está registrado.',
            'folio.required' => 'El folio es obligatorio.',
            'folio.max' => 'El folio no puede tener más de 50 caracteres.',
            'folio.unique' => 'El folio ya está registrado.',
            'publication_year.required' => 'El año de publicación es obligatorio.',
            'publication_year.integer' => 'El año de publicación debe ser un número.',
            'publication_year.min' => 'El año de publicación no puede ser menor a 1200.',
            'publication_year.max' => 'El año de publicación no puede ser mayor a ' . date('Y') . '.',
            'cover_image.image' => 'La portada debe ser una imagen.',
            'cover_image.mimes' => 'La portada debe ser un archivo de tipo: webp, jpeg, png, jpg, gif, svg.',
            'cover_image.max' => 'La portada no puede pesar más de 2MB.',
            'description.max' => 'La descripción no puede tener más de 1000 caracteres.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'publisher_id.exists' => 'La editorial seleccionada no existe.',
            'genre_id.exists' => 'El género seleccionado no existe.',
            'authors.array' => 'Los autores deben ser un arreglo.',
            'authors.*.exists' => 'Algún autor seleccionado no existe.',
            'book_details.language.max' => 'El idioma no puede tener más de 50 caracteres.',
            'book_details.pages.max' => 'Las páginas no pueden tener más de 10 caracteres.',
            'book_details.edition.max' => 'La edición no puede tener más de 50 caracteres.',
            'book_details.isbn13.max' => 'El ISBN13 no puede tener más de 20 caracteres.',
            'inventory.quantity.integer' => 'La cantidad debe ser un número entero.',
            'inventory.quantity.min' => 'La cantidad no puede ser negativa.',
            'inventory.condition.in' => 'La condición debe ser: nuevo, usado o deteriorado.',
            'inventory.status.in' => 'El estado debe ser: disponible, prestado o reservado.',
            'inventory.location.max' => 'La ubicación no puede tener más de 255 caracteres.',
        ];
    }
}
