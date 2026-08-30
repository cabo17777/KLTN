<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'user_id',
        'amount',
        'items',
        'address',
        'status',
        'payment_method',
        'payment',
        'date',
    ];

    protected $casts = [
        'items' => 'array',
        'address' => 'array',
        'payment' => 'boolean',
        'amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
