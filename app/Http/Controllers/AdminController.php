<?php

namespace App\Http\Controllers;

use App\Models\CmsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function login(Request $request) {
        if ($request->method() == "GET") {
            return view('admin.login');
        } else {
            $loggingIn = Auth::guard('admin')->attempt([
                'email' => $request->email,
                'password' => $request->password,
            ]);

            if (!$loggingIn) {
                return redirect()->back()->withErrors([
                    'Kombinasi email dan password salah'
                ]);
            }

            return redirect()->route('admin.dashboard');
        }
    }

    public function dashboard() {
        return view('admin.dashboard');
    }
    public function cms() {
        $categories = CmsCategory::orderBy('name', 'ASC')->get();
        return view('admin.cms', [
            'categories' => $categories,
        ]);
    }
}
