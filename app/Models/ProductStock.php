<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductStock extends Model
{
    protected $fillable = [
        'store_id', 'product_id', 'supplier_id',
        'label', 'cost_price', 'start_quantity', 'quantity', 'expired_at',
    ];

    public function scopeValidAvailable($query)
    {
        return $query->where('quantity', '>', 0)
            ->where(function ($q) {
                $q->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}
