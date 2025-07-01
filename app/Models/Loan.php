<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'librarian_id',
        'reservation_id',
        'status',
        'borrowed_at',
        'due_date',
        'left_credential',
        'returned_at',
        'fine_amount',
        'notes',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'due_date' => 'date',
        'returned_at' => 'datetime',
        'fine_amount' => 'decimal:2',
    ];

    // Relations 
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function librarian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'librarian_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    // Scopes 
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'active')
            ->where('due_date', '<', now());
    }

    public function scopeReturned($query)
    {
        return $query->where('status', 'returned');
    }


    // Methods 
    public function isOverdue(): bool
    {
        return $this->status === 'active' && $this->due_date->isPast();
    }

    public function getDaysOverdue(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }
        return now()->diffInDays($this->due_date);
    }

    public function calculateFine(): float
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        $daysOverdue = $this->getDaysOverdue();
        $dailyRate = 1.00; // $1 por día de retraso
        return $daysOverdue * $dailyRate;
    }

    public function return(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $this->update([
            'status' => 'returned',
            'returned_at' => now(),
            'fine_amount' => $this->calculateFine()
        ]);

        return true;
    }
}
