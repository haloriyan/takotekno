<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsContent extends Model
{
    protected $fillable = [
        'title', 'slug', 'body', 'cover', 'photographer', 'photographer_url',
    ];

    public function categories() {
        return $this->belongsToMany(CmsCategory::class, 'cms_content_categories', 'content_id', 'category_id');
    }
    public function slides() {
        return $this->hasMany(CmsContentSlide::class, 'content_id');
    }
    // public function categories() {
    //     return $this->hasMany(CmsContentCategory::class, 'content_id');
    // }
}
