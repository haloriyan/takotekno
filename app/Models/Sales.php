<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sales extends Model
{
    protected $fillable = [
        'store_id', 'user_id', 'customer_id', 'movement_id',
        'invoice_number', 'total_quantity', 'total_price', 'total_margin', 'notes'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function customer() {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
    public function items() {
        return $this->hasMany(SalesItem::class, 'sales_id');
    }
}
