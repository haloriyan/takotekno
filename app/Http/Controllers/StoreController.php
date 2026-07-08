<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sales;
use App\Models\StockMovementItem;
use App\Models\Store;
use App\Models\StorePlan;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserStore;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    public function onboarding(Request $request)
    {
        $session = $request->user();

        $u = User::where('id', $session->id);
        $user = $u->first();

        $icon = $request->file('icon');
        $iconFileName = $icon->getClientOriginalName();

        $store = Store::create([
            'name' => $request->name,
            'username' => Str::random(8),
            'icon' => $iconFileName,
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'max_radius_attendance' => 100,
            'package' => 'basic',
            'inventory_method' => 'FIFO',
        ]);

        $access = UserStore::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'role' => 'owner',
        ]);

        $u->update([
            'access_id' => $access->id,
        ]);

        $user = $u->with(['access.store', 'accesses'])->first();

        $icon->move(
            public_path('storage/store_icons'), $iconFileName
        );

        return response()->json([
            'store' => $store,
        ]);
    }

    public function upgrade(Request $request)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $quantity = $request->quantity;
        $plans = config('plans');
        $paket = $plans[$request->plan];

        $lastExpiredAt = StorePlan::where('store_id', $storeID)->max('expired_at');
        $baseDate = ($lastExpiredAt && Carbon::parse($lastExpiredAt)->isFuture())
            ? Carbon::parse($lastExpiredAt)
            : Carbon::now();

        $expiredAt = $baseDate->addMonths($quantity)->format('Y-m-d H:i:s');

        $purchase = StorePlan::create([
            'store_id' => $storeID,
            'plan' => $request->plan,
            'quantity' => $quantity,
            'expired_at' => $expiredAt,
            'payment_amount' => $quantity * $paket['price'],
            'payment_status' => 'PENDING',
        ]);

        return response()->json([
            'message' => 'Berhasil mengupgrade paket',
            'purchase' => $purchase,
        ]);
    }

    public function planHistory(Request $request)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;

        $transactions = StorePlan::where('store_id', $storeID)
            ->orderBy('created_at', 'DESC')
            ->paginate(25);

        return response()->json([
            'transactions' => $transactions,
        ]);
    }

    public function category(Request $request)
    {
        $user = $request->user();
        $categories = Category::where('store_id', $user->access->store_id)
            ->with(['products'])
            ->orderBy('position', 'ASC')->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function product(Request $request)
    {
        $user = $request->user();
        $products = Product::where('store_id', $user->access->store_id)
            ->with(['images', 'categories'])
            ->withSum(['stocks as valid_stock' => function ($query) {
                $query->validAvailable();
            }], 'quantity')
            ->paginate(25);

        return response()->json([
            'products' => $products,
        ]);
    }

    public function supplier(Request $request)
    {
        $user = $request->user();
        $suppliers = Supplier::where('store_id', $user->access->store_id)->paginate(25);

        return response()->json([
            'suppliers' => $suppliers,
        ]);
    }

    public function customer(Request $request)
    {
        $user = $request->user();
        $customers = Customer::where('store_id', $user->access->store_id)->paginate(25);

        return response()->json([
            'customers' => $customers,
        ]);
    }

    public function salesReport(Request $request) {
        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();
        $user = $request->user();
        $storeID = $user->access->store_id;

        $query = Sales::where('store_id', $storeID)
            ->whereBetween('created_at', [$startDate->format('Y-m-d H:i:s'), $endDate->format('Y-m-d H:i:s')])
            ->orderBy('created_at', 'DESC');

        $omset = $query->sum('total_price');
        $margin = $query->sum('total_margin');

        $sales = (clone $query)->with(['user', 'customer'])->paginate(25);

        $volumeData = Sales::where('store_id', $storeID)
            ->whereBetween('created_at', [$startDate->format('Y-m-d H:i:s'), $endDate->format('Y-m-d H:i:s')])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $volume = [];
        $current = $startDate->copy();
        while ($current <= $endDate) {
            $dateStr = $current->format('Y-m-d');
            $volume[] = [
                'date' => $dateStr,
                'count' => $volumeData[$dateStr] ?? 0
            ];
            $current->addDay();
        }

        return response()->json([
            'sales' => $sales,
            'omset' => $omset,
            'margin' => $margin,
            'volume' => $volume,
        ]);
    }
    public function movementReport(Request $request) {
        $startDate = Carbon::parse($request->start_date)->startOfDay()->format('Y-m-d H:i:s');
        $endDate = Carbon::parse($request->end_date)->endOfDay()->format('Y-m-d H:i:s');
        $user = $request->user();
        $storeID = $user->access->store_id;

        $products = Product::query()
        ->select('products.*')
        ->leftJoin('stock_movement_items', 'stock_movement_items.product_id', '=', 'products.id')
        ->leftJoin('stock_movements', 'stock_movements.id', '=', 'stock_movement_items.movement_id')
        ->where('products.store_id', $storeID)
        ->whereBetween('stock_movements.created_at', [$startDate, $endDate])
        ->groupBy('products.id')
        ->selectRaw("
            MAX(stock_movements.created_at) AS latest_movement_at,
            COALESCE(SUM(CASE WHEN stock_movements.type = 'IN' THEN stock_movement_items.quantity ELSE 0 END), 0) AS movement_in,
            COALESCE(SUM(CASE WHEN stock_movements.type = 'OUT' THEN stock_movement_items.quantity ELSE 0 END), 0) AS movement_out,
            COALESCE(SUM(CASE WHEN stock_movements.type = 'OPN' THEN stock_movement_items.quantity ELSE 0 END), 0) AS movement_opn
        ")
        ->orderByDesc('latest_movement_at')
        ->with(['images'])
        ->get();

        return response()->json([
            'products' => $products,
        ]);
    }
}
