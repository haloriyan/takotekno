<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsContentCategory extends Model
{
    protected $fillable = [
        'category_id', 'content_id'
    ];

    public function category() {
        return $this->hasMany(CmsCategory::class, 'category_id');
    }
    public function content() {
        return $this->hasMany(CmsContent::class, 'content_id');
    }
}
