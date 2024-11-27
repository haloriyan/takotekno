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
        // $posts = Http::get($this->wpUrl . "/posts", [
        //     'per_page' => 12,
        // ])->body();
        // $posts = json_decode($posts, false);

        return view('index', [
            // 'posts' => $posts,
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
                'question' => "Saya punya pengalaman di mana programmer saya kabur. Bagaimana?",
                'answer' => "Kami selalu bekerja secara profesional salah satunya dalam bentuk membuat MoU setiap sebelum pengerjaan projek. Sehingga jika terjadi wanprestasi dapat diajukan ke ranah hukum sesuai undang-undang yang berlaku.",
            ],
            [
                'question' => "Apa yang perlu Saya siapkan sebelum proses pembuatan aplikasinya?",
                'answer' => "Kami adalah pendengar yang baik. Ceritakan kepada kami apa yang ingin Anda capai. Dan setelah gambaran sistem disepakati, Anda dapat mengirimkan aset-aset yang diperlukan seperti grafis atau copywriting yang diperlukan.",
            ],
            [
                'question' => "Berapa lama proses pengerjaannya?",
                'answer' => "Kami tidak dapat memastikan tetapi untuk gambaran, satu modul biasanya memerlukan waktu 6 hingga 10 jam.",
            ],
            [
                'question' => "Seandainya nanti kalau ada error bagaimana?",
                'answer' => "Selama 3 bulan setelah serah-terima kami akan memperbaikinya untuk Anda secara gratis. Namun Anda akan tetap kena charge jika melebihi periode garansi atau ada penambahan baru.",
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

        $faqs = [
            [
                'question' => "Berapa biaya yang sebenarnya saya butuhkan?",
                'answer' => "Setiap produk memiliki demand yang berbeda, sehingga semakin tinggi demand atau persaingannya maka semakin besar biaya yang harus Anda keluarkan. Namun jika memang budget sangat terbatas, Anda tetap dapat menjalankan iklan dengan budget minimal Rp 50.000 per hari.",
            ],
            [
                'question' => "Bagaimana saya bisa melihat laporannya dan apakah laporannya asli?",
                'answer' => "Dalam setiap waktu tertentu kami akan membagikan tautan untuk melihat laporan performa kampanye yang dijalankan. Tautan dan laporan ini dibuat langsung oleh platform (Meta dan Google) sehingga Anda dapat melihatnya secara aktual. Anda juga dapat mengunduh ke Excel untuk keperluan kantor lainnya.",
            ],
            [
                'question' => "Apa yang perlu saya siapkan?",
                'answer' => "Informasi lengkap mengenai produk akan sangat membantu. Juga materi iklan berupa gambar atau video beserta caption.",
            ],
        ];

        return view('service.ad', [
            'types' => $types,
            'faqs' => $faqs,
        ]);
    }

    public function blog() {
        // $posts = Http::get($this->wpUrl . "/posts", [
        //     'per_page' => 12,
        // ])->body();
        // $posts = json_decode($posts, false);

        return view('blog', [
            'posts' => $posts,
        ]);
    }
}
