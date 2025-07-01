<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookDetail extends Model
{
    protected $fillable = ['book_id', 'language', 'pages', 'weight', 'dimensions', 'edition', 'isbn13'];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
