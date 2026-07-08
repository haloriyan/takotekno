<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplierStoreRequest;
use App\Http\Requests\SupplierUpdateRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    public function store(SupplierStoreRequest $request)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;

        $toCreate = [
            'store_id' => $storeID,
            'name' => $request->name,
            'address' => $request->address,
            'pic_name' => $request->pic_name,
            'pic_email' => $request->pic_email,
            'pic_phone' => $request->pic_phone,
        ];

        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconFileName = $storeID.'_'.$icon->getClientOriginalName();
            $toCreate['icon'] = $iconFileName;
            $icon->move(
                public_path('storage/supplier_icons'),
                $iconFileName
            );
        }

        $supplier = Supplier::create($toCreate);

        return response()->json([
            'message' => 'Berhasil menambahkan supplier baru',
            'supplier' => $supplier,
        ]);
    }

    public function update(SupplierUpdateRequest $request, $id)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $supplier = Supplier::where('id', $id)->where('store_id', $storeID)->first();

        if (!$supplier) {
            return response()->json([
                'message' => 'Supplier tidak ditemukan',
            ], 404);
        }

        $toUpdate = [
            'name' => $request->name,
            'address' => $request->address,
            'pic_name' => $request->pic_name,
            'pic_email' => $request->pic_email,
            'pic_phone' => $request->pic_phone,
        ];

        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconFileName = $storeID.'_'.$icon->getClientOriginalName();
            $toUpdate['icon'] = $iconFileName;
            $icon->move(
                public_path('storage/supplier_icons'),
                $iconFileName
            );
        }

        $supplier->update($toUpdate);

        return response()->json([
            'message' => 'Berhasil memperbarui supplier',
            'supplier' => $supplier,
        ]);
    }

    public function delete(Request $request, $id)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $supplier = Supplier::where('id', $id)->where('store_id', $storeID)->first();

        if (!$supplier) {
            return response()->json([
                'message' => 'Supplier tidak ditemukan',
            ], 404);
        }

        if ($supplier->icon != null) {
            Storage::delete('public/supplier_icons/'.$supplier->icon);
        }

        $supplier->delete();

        return response()->json([
            'message' => 'Berhasil menghapus supplier '.$supplier->name,
        ]);
    }
}
