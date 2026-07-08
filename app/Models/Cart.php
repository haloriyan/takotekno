<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'store_id', 'user_id', 'product_id', 'stock_id',
        'price', 'quantity', 'total_price', 'notes'
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function stock() {
        return $this->belongsTo(ProductStock::class, 'stock_id');
    }
}
