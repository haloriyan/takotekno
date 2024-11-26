<?php

namespace App\Http\Controllers;

use App\Mail\ContactForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;

class PageController extends Controller
{
    public $wpUrl;

    public function __construct() {
        $this->wpUrl = env('WP_URL') . "/wp-json/wp/v2";
    }
    public function index() {
        $posts = Http::get($this->wpUrl . "/posts", [
            'per_page' => 12,
        ])->body();
        $posts = json_decode($posts, false);

        return view('index', [
            'posts' => $posts,
        ]);
    }
    public function contact() {
        $message = Session::get('message');

        return view('contact', [
            'message' => $message,
        ]);
    }
    public function contactSubmit(Request $request) {
        Mail::to("takotekno.com@gmail.com")->send(
            new ContactForm([
                'name' => $request->name,
                'contact' => $request->contact,
                'body' => $request->message,
            ])
        );

        return redirect()->route('contact')->with(([
            'message' => "Pesan terkirim. Tim Kami akan menghubungi Anda segera. Terima Kasih"
        ]));
    }
    public function about() {
        return view('about');
    }

    public function serviceDev() {
        $types = [
            [
                'icon' => '<ion-icon name="storefront-outline" class="text-blue-500"></ion-icon>',
                'label' => "E-Commerce",
            ],
            [
                'icon' => '<ion-icon name="cog-outline" class="text-red-500"></ion-icon>',
                'label' => "Sistem Informasi",
            ],
            [
                'icon' => '<ion-icon name="document-outline" class="text-green-500"></ion-icon>',
                'label' => "Company Profile",
            ],
            [
                'icon' => '<ion-icon name="school-outline" class="text-orange-500"></ion-icon>',
                'label' => "Learning Management System",
            ],
            [
                'icon' => '<ion-icon name="bag-outline" class="text-purple-500"></ion-icon>',
                'label' => "Point of Sale",
            ],
            [
                'icon' => '<ion-icon name="list-outline" class="text-yellow-500"></ion-icon>',
                'label' => "Direktori",
            ],
            [
                'icon' => '<ion-icon name="videocam-outline" class="text-red-500"></ion-icon>',
                'label' => "Media / Streaming",
            ],
            [
                'icon' => '<ion-icon name="people-outline" class="text-purple-500"></ion-icon>',
                'label' => "HR & Sistem Penggajian",
            ],
            [
                'icon' => '<ion-icon name="albums-outline" class="text-blue-500"></ion-icon>',
                'label' => "Warehouse & Pergudangan",
            ],
            [
                'icon' => '<ion-icon name="apps-outline" class="text-slate-700"></ion-icon>',
                'label' => "Aplikasi yang Terintegrasi",
            ],
        ];

        $faqs = [
            [
                'question' => "Jika ditanya begini",
                'answer' => "Jawabnya begitu",
            ],
            [
                'question' => "Kalau ditanya begitu",
                'answer' => "Jawabnya begini",
            ],
        ];

        return view('service.development', [
            'types' => $types,
            'faqs' => $faqs,
        ]);
    }
    public function serviceContent() {
        return view('service.content');
    }
    public function serviceAd() {
        $types = [
            [
                'icon' => '<ion-icon name="volume-high-outline" class="text-green-500"></ion-icon>',
                'title' => "Awareness",
                'description' => "Jangkauan Pos, Tayangan Video"
            ],
            [
                'icon' => '<ion-icon name="bar-chart-outline" class="text-blue-500"></ion-icon>',
                'title' => "Traffic",
                'description' => "Traffic Situs Web atau Link Eksternal"
            ],
            [
                'icon' => '<ion-icon name="chatbubbles-outline" class="text-orange-500"></ion-icon>',
                'title' => "Engagement",
                'description' => "Like, Komen, Kirim Pesan"
            ],
            [
                'icon' => '<ion-icon name="filter-outline" class="text-red-500"></ion-icon>',
                'title' => "Leads",
                'description' => "Kirim Pesan, Telepon, Isi Formulir Prospek"
            ],
        ];

        return view('service.ad', [
            'types' => $types,
        ]);
    }

    public function blog() {
        $posts = Http::get($this->wpUrl . "/posts", [
            'per_page' => 12,
        ])->body();
        $posts = json_decode($posts, false);

        return view('blog', [
            'posts' => $posts,
        ]);
    }
}
