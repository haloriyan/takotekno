<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'index'])->name('index');
Route::get('tentang', [PageController::class, 'about'])->name('about');
Route::get('faq', [PageController::class, 'faq'])->name('faq');
Route::get('blog', [PageController::class, 'blog'])->name('blog');

Route::group(['prefix' => "layanan"], function () {
    Route::get('/dev', [PageController::class, 'serviceDev'])->name('service.dev');
    Route::get('/konten', [PageController::class, 'serviceContent'])->name('service.content');
    Route::get('/iklan-digital', [PageController::class, 'serviceAd'])->name('service.ad');
    Route::get('/', [PageController::class, 'service'])->name('service');
});

Route::get('hubungi-kami', [PageController::class, 'contact'])->name('contact');
Route::post('hubungi-kami/submit', [PageController::class, 'contactSubmit'])->name('contact.submit');
