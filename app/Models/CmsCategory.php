<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsCategory extends Model
{
    protected $fillable = [
        'name', 'slug', 'post_count'
    ];

    public function posts() {
        return $this->belongsToMany(CmsContent::class, 'cms_content_categories', 'category_id', 'content_id');
    }
}
