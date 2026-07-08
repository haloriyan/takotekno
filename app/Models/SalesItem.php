<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesItem extends Model
{
    protected $fillable = [
        'store_id', 'sales_id', 'product_id', 'stock_id', 'movement_item_id',
        'price', 'quantity', 'total_price', 'margin', 'notes'
    ];

    public function sales() {
        return $this->belongsTo(Sales::class, 'sales_id');
    }
    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function stock() {
        return $this->belongsTo(ProductStock::class, 'stock_id');
    }
}
