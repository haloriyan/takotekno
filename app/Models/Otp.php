<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $fillable = [
        'user_id', 'code', 'purpose', 'has_used', 'expired_at',
    ];
}
