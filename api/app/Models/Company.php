<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'document',
        'email',
        'phone',
        'settings',
        'domain',
        'logo',
        'icon',
        'favicon'
    ];

    protected $casts = [
        'settings' => 'array'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
} 