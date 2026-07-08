<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'store_id', 'user_id', 'supplier_id',
        'label', 'type', 'total_quantity', 'total_price', 'notes'
    ];

    public function supplier() {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
