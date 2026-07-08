<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'store_id', 'name', 'description', 'price', 'point'
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class, 'product_id');
    }

    public function stock()
    {
        return $this->hasOne(ProductStock::class)
            ->where('quantity', '>', 0);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }
    public function image_labels() {
        return $this->hasMany(ProductImageLabel::class, 'product_id');
    }
    public function movement_items() {
        return $this->hasMany(StockMovementItem::class, 'product_id');
    }
}
