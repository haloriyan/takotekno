<?php

namespace App\Http\Controllers;

use App\Models\CmsCategory;
use App\Models\CmsContent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index() {
        return view('index');
    }
    public function about() {
        return view('about');
    }
    public function contact() {
        return view('contact');
    }
    public function privacyPolicy() {
        return view('about.privacy');
    }
    public function pricing() {
        $plans = config('plans');
        return view('pricing', [
            'plans' => $plans,
        ]);
    }

    public function caseWarkop() {
        return view('case.warkop');
    }
    public function caseWarmad() {
        return view('case.warmad');
    }

    public function blog() {
        $categories = CmsCategory::orderBy('name', 'ASC')
        ->with([
            'posts' => function ($query) {
                $query->inRandomOrder()->take(15);
            }
        ])
        ->get();

        $featured = CmsContent::inRandomOrder()->take(5)->get();
        $sections = CmsCategory::inRandomOrder()->take(5)
        ->with([
            'posts' => function ($query) {
                $query->inRandomOrder()->take(15);
            }
        ])
        ->get();

        return view('blog.index', [
            'categories' => $categories,
            'featured' => $featured,
            'sections' => $sections,
        ]);
    }
    public function blogRead($slug) {
        $post = CmsContent::where('slug', $slug)->with(['slides','categories'])->first();
        $related = CmsContent::whereHas('categories', function ($query) use ($post) {
            $query->whereIn('category_id', $post->categories->pluck('id'));
        })
        ->take(10)
        ->inRandomOrder()
        ->get();
        
        $sections = CmsCategory::inRandomOrder()->take(3)
        ->with([
            'posts' => function ($query) {
                $query->inRandomOrder()->take(15);
            }
        ])
        ->get();

        return view('blog.read', [
            'post' => $post,
            'related' => $related,
            'sections' => $sections,
        ]);
    }
    public function blogCategory($slug) {
        $category = CmsCategory::where('slug', $slug)->first();
        $posts = CmsContent::whereHas('categories', function ($query) use ($category) {
            $query->where('category_id', $category->id);
        })
        ->paginate(12);
        
        $categories = CmsCategory::orderBy('name', 'ASC')
        ->get();

        return view('blog.category', [
            'categories' => $categories,
            'category' => $category,
            'posts' => $posts,
        ]);
    }
    public function faq(Request $request) {
        $topics = [
            'Umum', 'Produk', 'Transaksi & Pembayaran',
        ];
        $faqs = [
            [
                'question' => "Jika ditanya begini",
                'answer' => "Jawabannya begitu"
            ],
            [
                'question' => "Kalau ditanya begitu",
                'answer' => "Jawabannya harus begini"
            ],
        ];
        // Str::slug('h',);

        return view('faq', [
            'topics' => $topics,
            'request' => $request,
            'faqs' => json_decode(json_encode($faqs), false)
        ]);
    }
}
