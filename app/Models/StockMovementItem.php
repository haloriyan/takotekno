<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovementItem extends Model
{
    protected $fillable = [
        'store_id', 'movement_id', 'product_id', 'stock_id',
        'price', 'quantity', 'total_price'
    ];

    public function stock() {
        return $this->belongsTo(ProductStock::class, 'stock_id');
    }
    public function store() {
        return $this->belongsTo(Store::class, 'store_id');
    }
    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function movement() {
        return $this->belongsTo(StockMovement::class, 'movement_id');
    }
}
