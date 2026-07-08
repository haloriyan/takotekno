<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StorePlan extends Model
{
    protected $fillable = [
        'store_id', 'plan', 'quantity', 'expired_at',
        'payment_amount', 'payment_status',
    ];
}
