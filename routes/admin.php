<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => "admin"], function () {
    Route::match(['get', 'post'], "login", [AdminController::class, 'login'])->name('admin.login');
    Route::group(['middleware' => "Admin"], function () {
        Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('cms', [AdminController::class, 'cms'])->name('admin.cms');
        Route::get('logout', [AdminController::class, 'logout'])->name('admin.logout');
    });
});