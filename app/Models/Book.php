<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    const BOOK_RELATIONS = [
        'category',
        'publisher',
        'genre',
        'bookDetails',
        'inventory',
        'authors'
    ];

    protected $fillable = ['title', 'isbn', 'folio', 'publication_year', 'cover_image', 'description', 'is_active', 'category_id', 'publisher_id', 'genre_id'];

    public function scopeWithAllRelations($query)
    {
        return $query->with(self::BOOK_RELATIONS);
    }


    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * Determina si el libro está disponible para préstamo o reserva.
     * 
     * Un libro se considera disponible si:
     * - Está activo (is_active = true)
     * - Tiene más de 3 ejemplares disponibles en inventario
     * - Excepción: si el libro tiene 3 o menos ejemplares, puede estar disponible por alguna razón especial
     * 
     * @return bool
     */
    public function isAvailable(): bool
    {
        // Verifica si el libro está activo
        if (!$this->is_active) {
            return false;
        }

        // Verifica si tiene relación de inventario
        if (!$this->relationLoaded('inventory')) {
            $this->load('inventory');
        }

        $quantity = $this->inventory->quantity ?? 0;

        // Si hay más de 3 ejemplares, está disponible
        if ($quantity > 3) {
            return true;
        }

        // Excepción: si hay 3 o menos ejemplares, puede estar disponible (por ejemplo, si solo hay un ejemplar)
        // Aquí puedes agregar lógica adicional para excepciones específicas si lo necesitas
        // Por ahora, permitimos que esté disponible si hay al menos 1 ejemplar
        if ($quantity > 0) {
            return true;
        }

        // Si no hay ejemplares, no está disponible
        return false;
    }

    public function getActiveLoan()
    {
        return $this->loans()->active()->first();
    }

    public function getActiveReservation()
    {
        return $this->reservations()->active()->first();
    }

    /**
     * Scope para filtrar libros disponibles.
     * Un libro se considera disponible si:
     * - Está activo (is_active = true)
     * - Tiene más de 3 ejemplares en inventario (quantity > 3)
     * - Si hay 3 o menos ejemplares, puede haber excepciones (por ejemplo, si la biblioteca solo tiene un ejemplar)
     * 
     * No importa si tiene préstamos o reservas mientras haya más de 3 ejemplares.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
            ->whereHas('inventory', function ($q) {
                $q->where('quantity', '>', 3)
                    ->orWhere(function ($q2) {
                        // Excepción: permitir si solo hay 1 ejemplar (o menos de 3) por alguna razón especial
                        $q2->where('quantity', '<=', 3);
                        // Aquí podrías agregar lógica adicional para excepciones específicas si lo necesitas
                    });
            });
    }


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function bookDetails()
    {
        return $this->hasOne(BookDetail::class);
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function authors()
    {
        return $this->belongsToMany(Author::class);
    }

    /**
     * Obtener la URL completa de la imagen de portada
     */
    public function getCoverImageUrlAttribute()
    {
        if (empty($this->cover_image)) {
            return null;
        }

        // Si ya es una URL completa, devolverla tal como está
        if (filter_var($this->cover_image, FILTER_VALIDATE_URL)) {
            return $this->cover_image;
        }

        // Si es una ruta relativa, construir la URL completa
        return Storage::disk('public')->url($this->cover_image);
    }

    /**
     * Scope para filtrar libros por título, ISBN o autores.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchable($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('isbn', 'like', "%{$search}%")
                ->orWhereHas('authors', function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%");
                });
        });
    }
}
