<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\ProductImageLabel;
use App\Models\ProductStock;
use App\Models\StockMovement;
use App\Models\StockMovementItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function scan(Request $request) {
        $user = $request->user();
        $storeID = $user->access_id;
        $labels = $request->labels;

        $rawData = ProductImageLabel::where(function ($q) use ($labels) {
            foreach ($labels as $label) {
                $q->orWhere('label', 'LIKE', '%'.$label.'%');
            }
        })
        ->where('store_id', $storeID)
        ->with(['product.image_labels:product_id,label', 'product.images'])
        ->get();

        $products = [];
        $productIDs = [];

        foreach ($rawData as $d => $data) {
            $product = $data->product;
            $product->labels = $product->image_labels->pluck('label');
            $index = array_search($product->id, $productIDs);
            
            if ($index === false) {
                $product->weight = 1;
                array_push($productIDs, $product->id);
                array_push($products, $product);
            } else {
                $products[$index]->weight += 1;
            }
        }

        $products = collect($products)
            ->sortByDesc('weight')
            ->values()
            ->all();

        if (!empty($products)) {
            $topWeight = $products[0]->weight;
            $products = array_values(array_filter($products, fn($product) => $product->weight === $topWeight));
        }

        return response()->json([
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $storeID = $user->access_id;
        $categories = json_decode($request->categories, false);
        $images = $request->file('images');
        $imagesPayload = json_decode($request->images_payload);

        $product = Product::create([
            'store_id' => $storeID,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'point' => $request->point,
        ]);

        if ($request->hasFile('images')) {
            foreach ($images as $img) {
                $fileName = $img->getClientOriginalName();
                $image = ProductImage::create([
                    'product_id' => $product->id,
                    'store_id' => $storeID,
                    'filename' => $fileName,
                ]);

                $img->move(
                    public_path('storage/product_images/'.$product->id),
                    $fileName
                );

                if (isset($imagesPayload->{$fileName}->labels)) {
                    foreach ($imagesPayload->{$fileName}->labels as $label) {
                        ProductImageLabel::create([
                            'product_id' => $product->id,
                            'store_id' => $storeID,
                            'image_id' => $image->id,
                            'label' => $label,
                        ]);
                    }
                }
            }
        }

        foreach ($categories as $cat) {
            ProductCategory::create([
                'product_id' => $product->id,
                'category_id' => $cat->id,
            ]);
        }

        return response()->json([
            'message' => 'Berhasil menambahkan produk '.$product->name,
            'product' => $product,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $storeID = $user->access_id;
        $product = Product::where('id', $id)->where('store_id', $storeID)->first();

        if (! $product) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'point' => $request->point,
        ]);

        if ($request->has('categories')) {
            $categories = json_decode($request->categories, false);
            ProductCategory::where('product_id', $id)->delete();
            foreach ($categories as $cat) {
                ProductCategory::create([
                    'product_id' => $id,
                    'category_id' => $cat->id,
                ]);
            }
        }

        if ($request->hasFile('images')) {
            $images = $request->file('images');
            $imagesPayload = json_decode($request->images_payload);
            foreach ($images as $img) {
                $fileName = $img->getClientOriginalName();
                ProductImage::create([
                    'product_id' => $id,
                    'store_id' => $storeID,
                    'filename' => $fileName,
                ]);

                $img->move(
                    public_path('storage/product_images/'.$id),
                    $fileName
                );

                if (isset($imagesPayload->{$fileName}->labels)) {
                    $image = ProductImage::where('product_id', $id)
                        ->where('filename', $fileName)
                        ->latest()
                        ->first();

                    foreach ($imagesPayload->{$fileName}->labels as $label) {
                        ProductImageLabel::create([
                            'product_id' => $id,
                            'store_id' => $storeID,
                            'image_id' => $image->id,
                            'label' => $label,
                        ]);
                    }
                }
            }
        }

        return response()->json([
            'message' => 'Berhasil memperbarui produk '.$product->name,
            'product' => $product,
        ]);
    }

    public function delete(Request $request, $id)
    {
        $prod = Product::where('id', $id);
        $product = $prod->with(['images'])->first();

        $prod->delete();
        foreach ($product->images as $image) {
            Storage::delete('public/product_images/'.$id.'/'.$image->filename);
        }

        return response()->json([
            'message' => $product->name.' berhasil dihapus',
        ]);
    }

    public function detail(Request $request, $id)
    {
        $product = Product::where('id', $id)
        ->with(['images', 'categories'])
        ->first();
        
        if ($product) {
            $stocks = ProductStock::where('product_id', $id)
            ->where('quantity', '>', 0)
            ->where(function ($q) {
                $q->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->get();

            $product->quantity = $stocks->sum('quantity') ?? 0;

            $stockMovements = StockMovementItem::where([
                'product_id' => $id,
            ])
            ->with(['stock', 'movement'])
            ->take(10)
            ->orderBy('created_at', 'DESC')
            ->get();

            $product->stocks = $stocks;
            $product->stock_movements = $stockMovements;
        }

        return response()->json([
            'product' => $product,
        ]);
    }
    public function stock(Request $request, $id) {
        $stocks = ProductStock::where('product_id', $id)
        ->where('quantity', '>', 0)
        ->where(function ($query) {
            $query->whereNull('expired_at')
                ->orWhereDate('expired_at', '>=', now());
        })
        ->with('supplier')
        ->get();

        $invalidStocks = ProductStock::where('product_id', $id)
        ->where(function ($query) {
            $query->where('quantity', '<=', 0)
                ->orWhereDate('expired_at', '<', today());
        })
        ->with('supplier')
        ->paginate(25);

        return response()->json([
            'stocks' => $stocks,
            'invalid_stocks' => $invalidStocks,
        ]);
    }
    public function stockStore(Request $request, $id) {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $costPrice = $request->cost_price;
        $quantity = $request->quantity;

        $product = Product::where('id', $id)->first();

        $stock = ProductStock::create([
            'product_id' => $id,
            'store_id' => $storeID,
            'label' => $request->label,
            'quantity' => $quantity,
            'start_quantity' => $quantity,
            'cost_price' => $costPrice,
        ]);

        $movement = StockMovement::create([
            'user_id' => $user->id,
            'store_id' => $storeID,
            'label' => "IN" . Carbon::now()->isoFormat('YYYYMMDDHHmmss'),
            'total_quantity' => $quantity,
            'total_price' => $costPrice * $quantity,
            'type' => "IN"
        ]);

        StockMovementItem::create([
            'store_id' => $storeID,
            'product_id' => $id,
            'movement_id' => $movement->id,
            'stock_id' => $stock->id,
            'price' => $costPrice,
            'quantity' => $quantity,
            'total_price' => $costPrice * $quantity,
        ]);

        return response()->json([
            'message' => "Berhasil menambahkan stok untuk produk " . $product->name,
        ]);
    }
}
