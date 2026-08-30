<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'discount_price',
        'category',
        'brand',
        'image',
        'sizes',
        'colors',
        'bestseller',
        'stock',
    ];

    protected $casts = [
        'image' => 'array',
        'sizes' => 'array',
        'colors' => 'array',
        'bestseller' => 'boolean',
        'price' => 'float',
        'discount_price' => 'float',
    ];
}
