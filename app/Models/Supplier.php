<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'store_id', 'name', 'icon', 'address', 'pic_name', 'pic_email', 'pic_phone',
    ];
}
