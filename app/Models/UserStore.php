<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStore extends Model
{
    protected $fillable = [
        'user_id', 'store_id', 'role',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
