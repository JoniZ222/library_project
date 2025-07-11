<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publisher extends Model
{
    protected $fillable = ['name', 'address', 'phone', 'email', 'website', 'image'];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
