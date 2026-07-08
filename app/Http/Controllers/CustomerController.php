<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerStoreRequest;
use App\Http\Requests\CustomerUpdateRequest;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function search(Request $request) {
        $user = $request->user();
        $storeID = $user->access->store_id;

        $customers = Customer::where([
            ['store_id', $storeID],
            ['name', 'LIKE', '%'.$request->q.'%']
        ])
        ->take(5)
        ->get();

        return response()->json([
            'customers' => $customers
        ]);
    }

    public function store(CustomerStoreRequest $request)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;

        $toCreate = [
            'store_id' => $storeID,
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'point' => $request->point ?? 0,
        ];

        $customer = Customer::create($toCreate);

        return response()->json([
            'message' => 'Berhasil menambahkan customer baru',
            'customer' => $customer,
        ]);
    }

    public function update(CustomerUpdateRequest $request, $id)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $customer = Customer::where('id', $id)->where('store_id', $storeID)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Customer tidak ditemukan',
            ], 404);
        }

        $toUpdate = [
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'point' => $request->point ?? 0,
        ];

        $customer->update($toUpdate);

        return response()->json([
            'message' => 'Berhasil memperbarui customer',
            'customer' => $customer,
        ]);
    }

    public function delete(Request $request, $id)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $customer = Customer::where('id', $id)->where('store_id', $storeID)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Customer tidak ditemukan',
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'message' => 'Berhasil menghapus customer '.$customer->name,
        ]);
    }
}
