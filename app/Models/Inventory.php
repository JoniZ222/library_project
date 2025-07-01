<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = ['book_id', 'quantity', 'condition', 'location', 'status', 'notes'];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
