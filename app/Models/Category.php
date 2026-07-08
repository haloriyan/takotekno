<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'store_id', 'name', 'icon', 'color', 'position', 'pos_available',
    ];

    public function products()
    {
        return $this->belongsToMany(
            Product::class, 'product_categories'
        );
    }
}
