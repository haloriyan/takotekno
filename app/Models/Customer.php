<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'store_id', 'name', 'email', 'whatsapp',
        'point',
    ];
}
