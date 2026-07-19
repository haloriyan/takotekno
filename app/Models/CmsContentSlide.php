<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsContentSlide extends Model
{
    protected $fillable = [
        'content_id', 'title', 'body', 'cover'
    ];
}
