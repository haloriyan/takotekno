<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function store(CategoryStoreRequest $request)
    {
        $user = $request->user();
        $categories = Category::where('store_id', $user->access->store_id)->get(['id']);

        $toCreate = [
            'store_id' => $user->access_id,
            'name' => $request->name,
            'position' => $categories->count(),
            'pos_available' => $request->pos_available,
        ];

        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconFileName = $user->access->store_id.'_'.$icon->getClientOriginalName();
            $toCreate['icon'] = $iconFileName;
            $icon->move(
                public_path('storage/category_icons'),
                $iconFileName
            );
        }

        $category = Category::create($toCreate);

        return response()->json([
            'message' => 'Berhasil menambahkan kategori baru',
            'category' => $category,
        ]);
    }

    public function update(CategoryUpdateRequest $request, $id)
    {
        $user = $request->user();
        $storeID = $user->access->store_id;
        $category = Category::where('id', $id)->where('store_id', $storeID)->first();

        if (! $category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        $toUpdate = [
            'name' => $request->name,
            'pos_available' => $request->pos_available,
        ];

        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconFileName = $storeID.'_'.$icon->getClientOriginalName();
            $toUpdate['icon'] = $iconFileName;
            $icon->move(
                public_path('storage/category_icons'),
                $iconFileName
            );
        }

        $category->update($toUpdate);

        return response()->json([
            'message' => 'Berhasil memperbarui kategori',
            'category' => $category,
        ]);
    }

    public function delete(Request $request, $id)
    {
        $cat = Category::where('id', $id);
        $category = $cat->first();

        $cat->delete();
        if ($category->icon != null) {
            Storage::delete('public/category_icons/'.$category->icon);
        }

        return response()->json([
            'message' => 'Berhasil menghapus kategori '.$category->name,
        ]);
    }

    public function pos(Request $request, $id)
    {
        $cat = Category::where('id', $id);
        $category = $cat->first();

        $cat->update([
            'pos_available' => json_decode($request->status, false),
        ]);

        return response()->json([
            'message' => 'ok',
        ]);
    }

    public function reposition(Request $request)
    {
        foreach ($request->categories as $c => $cat) {
            Category::where('id', $cat['id'])->update([
                'position' => $c,
            ]);
        }

        return response()->json([
            'message' => 'ok',
        ]);
    }
}
