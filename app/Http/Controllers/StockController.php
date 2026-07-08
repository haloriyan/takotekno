<?php

namespace App\Http\Controllers;

use App\Models\ProductStock;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function store(Request $request, $productID) {
        // 

        return response()->json([
            'message' => "Berhasil menambahkan stok"
        ]);
    }
}
