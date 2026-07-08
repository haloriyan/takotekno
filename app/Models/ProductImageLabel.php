<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImageLabel extends Model
{
    protected $fillable = ['image_id', 'product_id', 'store_id', 'label'];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
