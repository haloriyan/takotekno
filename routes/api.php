<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('plan', [UserController::class, 'plan']);

Route::group(['prefix' => "v2"], function () {
    Route::get('tes', [CmsController::class, 'tes']);
    Route::post('home', [CmsController::class, 'home']);
    Route::post('preparation', [CmsController::class, 'preparation']);
    Route::post('store', [CmsController::class, 'store']);
});

Route::group(['prefix' => 'user'], function () {
    Route::post('login', [UserController::class, 'login']);
    Route::post('otp', [UserController::class, 'otp']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('access', [UserController::class, 'switchAccess']);
        Route::get('me', [UserController::class, 'me']);
    });
});

Route::group(['prefix' => 'store'], function () {
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('onboarding', [StoreController::class, 'onboarding']);

        Route::group(['prefix' => "customer"], function () {
            Route::get('/', [StoreController::class, 'customer']);
            Route::post('store', [CustomerController::class, 'store']);
            Route::post('{id}/update', [CustomerController::class, 'update']);
            Route::get('{id}/delete', [CustomerController::class, 'delete']);
            Route::get('search', [CustomerController::class, 'search']);
        });

        Route::group(['prefix' => "plan"], function () {
            Route::post('purchase', [StoreController::class, 'upgrade']);
            Route::get('history', [StoreController::class, 'planHistory']);
        });

        Route::group(['prefix' => 'category'], function () {
            Route::post('store', [CategoryController::class, 'store']);
            Route::post('reposition', [CategoryController::class, 'reposition']);
            Route::post('{id}/update', [CategoryController::class, 'update']);
            Route::get('{id}/pos', [CategoryController::class, 'pos']);
            Route::get('{id}/delete', [CategoryController::class, 'delete']);
            Route::get('/', [StoreController::class, 'category']);
        });

        Route::group(['prefix' => 'product'], function () {
            Route::post('store', [ProductController::class, 'store']);
            Route::post('scan', [ProductController::class, 'scan']);
            
            Route::group(['prefix' => "{id}"], function () {
                Route::post('update', [ProductController::class, 'update']);
                Route::get('delete', [ProductController::class, 'delete']);
                Route::get('detail', [ProductController::class, 'detail']);
                
                Route::group(['prefix' => "stock"], function () {
                    Route::post('store', [ProductController::class, 'stockStore']);
                    Route::get('/', [ProductController::class, 'stock']);
                });
            });
            
            Route::get('/', [StoreController::class, 'product']);
        });

        Route::group(['prefix' => "supplier"], function () {
            Route::get('/', [StoreController::class, 'supplier']);
            Route::post('store', [SupplierController::class, 'store']);
            Route::post('{id}/update', [SupplierController::class, 'update']);
            Route::get('{id}/delete', [SupplierController::class, 'delete']);
        });

        Route::group(['prefix' => "stock"], function () {
            Route::group(['prefix' => "{productID}"], function () {
                // Route::post('store', [StockController::class, 'store']);
            });
        });

        Route::group(['prefix' => "report"], function () {
            Route::get('sales', [StoreController::class, 'salesReport']);
            Route::get('sales/{id}/detail', [SalesController::class, 'detail']);
            Route::get('movement', [StoreController::class, 'movementReport']);
            Route::get('movement-detail/{productID}', [StoreController::class, 'movementReportDetail']);
        });
    });
});

Route::group(['prefix' => "pos", 'middleware' => "auth:sanctum"], function () {
    Route::group(['prefix' => "cart"], function () {
        Route::post('store', [CartController::class, 'store']);
        Route::post('remove', [CartController::class, 'remove']);
        Route::post('delete', [CartController::class, 'delete']);
        Route::get('/', [CartController::class, 'index']);
    });

    Route::post('place', [PosController::class, 'place']);
    Route::get('/', [PosController::class, 'index']);
});
