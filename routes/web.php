<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'index'])->name('index');
Route::group(['prefix' => "solusi"], function () {
    /*
    Gatau hari ini jualan berapa dapet berapa
    Stok gak cocok sama penjualan
    Karyawan telat
    */
    Route::get('omset', [PageController::class, 'solusiOmset'])->name('solusi.omset');
    Route::get('inventory', [PageController::class, 'solusiInventory'])->name('solusi.inventory');
    Route::get('absensi', [PageController::class, 'solusiAbsensi'])->name('solusi.absensi');
});
Route::group(['prefix' => "case"], function () {
    Route::get('warkop', [PageController::class, 'caseWarkop'])->name('case.warkop');
    Route::get('warung-madura', [PageController::class, 'caseWarmad'])->name('case.warmad');
    Route::get('restoran', [PageController::class, 'caseResto'])->name('case.resto');
});

Route::get('tentang', [PageController::class, 'about'])->name('about');
Route::get('kebijakan-privasi', [PageController::class, 'privacyPolicy'])->name('about.privacy');
Route::get('faq', [PageController::class, 'faq'])->name('about.faq');
Route::get('hubungi-kami', [PageController::class, 'contact'])->name('about.contact');
Route::get('pricing', [PageController::class, 'pricing'])->name('pricing');

Route::group(['prefix' => "blog"], function () {
    Route::get('/{slug}', [PageController::class, 'blogRead'])->name('blog.read');
    Route::get('/category/{slug}', [PageController::class, 'blogCategory'])->name('blog.category');
    Route::get('/', [PageController::class, 'blog'])->name('blog');
});

include __DIR__ . '/admin.php';