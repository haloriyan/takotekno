<?php

namespace App\Http\Controllers;

use App\Models\Sales;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function detail($id) {
        $sales = Sales::where('id', $id)
        ->with([
            'customer', 'user', 'items.product.images'
        ])
        ->first();

        return response()->json([
            'sales' => $sales,
        ]);
    }
}
