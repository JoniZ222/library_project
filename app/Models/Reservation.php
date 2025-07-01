<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'status',
        'reason',
        'reserved_at',
        'expires_at',
        'approved_at',
        'approved_by',
        'notes',
        'planned_return_date',
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
        'expires_at' => 'datetime',
        'approved_at' => 'datetime',
        'planned_return_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }


    // Scopes 
    public function scopePendingCredential($query)
    {
        return $query->where('status', 'pending_credential');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'approved']);
    }

    // Methods 
    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function canBeApproved(): bool
    {
        return in_array($this->status, ['pending', 'pending_credential']) && !$this->isExpired();
    }


    public function approve($librarianId): bool
    {
        if (!$this->canBeApproved()) {
            return false;
        }

        // Si está esperando credencial, verificar que ya esté verificada
        if ($this->status === 'pending_credential' && !$this->user->isCredentialVerified()) {
            return false;
        }

        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $librarianId,
            'expires_at' => now()->addDays(7)
        ]);

        return true;
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->whereHas('book', function ($q2) use ($term) {
                $q2->where('title', 'like', "%$term%")
                    ->orWhere('folio', 'like', "%$term%")
                    ->orWhere('isbn', 'like', "%$term%");
            })
            ->orWhereHas('user', function ($q2) use ($term) {
                $q2->where('name', 'like', "%$term%");
            });
        });
    }
}
