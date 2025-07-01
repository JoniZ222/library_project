<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'school_credential_path',
        'credential_verified_at',
        'verified_by',
        'status',
        'first_name',
        'last_name',
        'last_name_2',
        'matricula',
        'activation_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'boolean',
            'credential_verified_at' => 'datetime',
        ];
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function approvedReservations()
    {
        return $this->hasMany(Reservation::class, 'approved_by');
    }

    public function processedLoans()
    {
        return $this->hasMany(Loan::class, 'librarian_id');
    }

    public function isPublic(): bool
    {
        return in_array($this->role, ['public', 'member']);
    }

    public function isLibrarian(): bool
    {
        return $this->role === 'librarian';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Methods for school credential

    public function hasCredential(): bool
    {
        return !empty($this->school_credential_path);
    }

    public function isCredentialVerified(): bool
    {
        return !empty($this->credential_verified_at);
    }

    public function getCredentialUrlAttribute()
    {
        if (empty($this->school_credential_path)) {
            return null;
        }

        if (filter_var($this->school_credential_path, FILTER_VALIDATE_URL)) {
            return $this->school_credential_path;
        }

        return Storage::disk('public')->url($this->school_credential_path);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
