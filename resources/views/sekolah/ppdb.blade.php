@extends('layouts.page')

@section('title', "PPDB - ")

@php
    $whys = [
        [
            'icon' => "<ion-icon name='time-outline' class='text-4xl text-primary'></ion-icon>",
            'title' => "Proses Cepat",
            'description' => "Aplikasi siap dipasang sehingga tidak perlu menunggu lama untuk proses pembuatan.",
        ],
        [
            'icon' => "<ion-icon name='star-outline' class='text-4xl text-primary'></ion-icon>",
            'title' => "Berpengalaman",
            'description' => "Kami telah beroperasi selama 4 tahun bersama tim hebat dan menangani berbagai studi kasus.",
        ],
        [
            'icon' => "<ion-icon name='happy-outline' class='text-4xl text-primary'></ion-icon>",
            'title' => "Dukungan Penuh",
            'description' => "Kami menyediakan panduan untuk setiap pengoperasian dan pelatihan untuk operator Anda.",
        ],
        [
            'icon' => "<ion-icon name='laptop-outline' class='text-4xl text-primary'></ion-icon>",
            'title' => "Free Demo",
            'description' => "Kami menyediakan aplikasi demo untuk Anda eksplorasi sebelum memutuskan untuk menggunakan aplikasi Kami.",
        ],
        [
            'icon' => "<ion-icon name='hand-right-outline' class='text-4xl text-primary'></ion-icon>",
            'title' => "Mudah Digunakan",
            'description' => "Dirancang dengan mengedepankan kemudahan penggunaan bahkan untuk orang awam sekalipun. ",
        ],
        [
            'icon' => "<ion-icon name='sync-outline' class='text-4xl text-primary'></ion-icon>",
            'title' => "Fleksibilitas Tinggi",
            'description' => "Aplikasi dapat menyesuaikan kebutuhan unik yang setiap sekolah hadapi. ",
        ],
    ];
    $features = [
        [
            'title' => "Formulir dengan Isian Kustom",
            'description' => "Formulir pendaftaran yang dapat disesuaikan kebutuhan saat gelombang pendaftaran dimulai. Sekolah dapat merekam informasi calon siswa baru dan berkas-berkas yang dibutuhkan.",
            'image' => "images/ppdb/form.png"
        ],
        [
            'title' => "Pembayaran Multi-Channel",
            'description' => "Calon peserta didik dapat membayar biaya pendaftaran melalui Scan QRIS atau transfer ke Virtual Account BCA, BRI, BNI, dan CIMB Niaga. Dan pembayaran akan dicek secara otomatis oleh sistem.",
            'image' => "images/ppdb/payment.png"
        ],
        [
            'title' => "Pelacakan Status Pendaftaran",
            'description' => "Lihat data formulir yang telah dikirim, melacak status pendaftaran, hingga membayar biaya pendaftaran dari satu tempat. Calon siswa juga dapat mengeceknya secara mandiri.",
            'image' => "images/ppdb/status.png"
        ],
    ]
@endphp
    
@section('content')
<div class="bg-primary text-white p-20 py-56 mobile:p-10 mobile:py-36 flex gap-20 relative">
    <div class="w-7/12 mobile:w-full flex flex-col gap-6">
        <h2 class="text-4xl mobile:text-xl mobile:leading-10 font-medium">
            Penerimaan Siswa Baru yang Lebih Efisien
        </h2>
        <div class="leading-8  text-lg mobile:text-sm">
            Kurangi Beban Administratif dan Tingkatkan Akurasi Data dengan Sistem PPDB Terbaik. Dapatkan Pendaftaran Siswa Baru yang Mudah dan Efisien Sekarang!
        </div>
        <div class="flex items-center gap-6 mobile:gap-6 text-2xl">
            <a href="https://wa.me/6285159772902?text={{ urlencode('Halo, TakoTekno. Saya [NAMA_ANDA] dari [NAMA_SEKOLAH] ingin dibantu untuk membuat aplikasi PPDB Sekolah') }}" class="p-3 px-6 rounded border border-white font-medium text-sm bg-white text-primary">
                Hubungi Kami
            </a>
            <a href="https://ppdb.takotekno.com" class="p-3 px-6 rounded border border-white font-medium text-sm">
                Lihat Demo
            </a>
        </div>
    </div>
    <img src="{{ asset('images/ppdb/desktop.png') }}" alt="illus" class="w-5/12">
</div>

<div class="mt-10"></div>
@foreach ($features as $i => $item)
    <div class="p-10 px-20 mobile:p-10 flex {{ $i % 2 == 0 ? 'flex-row-reverse' : 'flex-row'}} mobile:flex-col gap-40 mobile:gap-10 items-center">
        <div class="flex flex-col grow gap-4">
            <h2 class="text-2xl text-primary font-medium">{{ $item['title'] }}</h2>
            <div class="w-24 h-1 bg-primary rounded-full mb-4"></div>
            <div class="mobile:text-sm text-slate-500 leading-8">
                {{ $item['description'] }}
            </div>
            <div class="flex mt-4">
                <a 
                    href="https://wa.me/6285159772902?text={{ urlencode('Halo, TakoTekno. Saya [NAMA_ANDA] dari [NAMA_SEKOLAH] ingin dibantu untuk membuat aplikasi PPDB Sekolah') }}" 
                    target="_blank"
                    class="bg-primary text-white text-sm font-medium p-4 px-6 rounded-full"
                >
                    Hubungi Kami
                </a>
            </div>
        </div>
        <img src="{{ asset($item['image']) }}" alt="form" class="w-3/12">
    </div>
@endforeach
<div class="mt-10"></div>

<div class="p-20 mobile:p-10 bg-primary-transparent">
    <h3 class="text-4xl text-primary">Apa Saja yang Akan Didapatkan?</h3>

    <div class="flex flex-wrap mobile:flex-col mt-10 gap-10">
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Source Code Penuh yang Dapat Dikembangkan Lagi</h4>
            <div class="text-sm text-slate-500 leading-8">Aplikasi yang kami buat selalu menggunakan sumber kode yang bersih dan rapi sehingga dapat dikembangkan lebih lanjut jika Anda memiliki programmer in-house atau ingin bekerja sama dengan agensi lainnya.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Free Server & Domain</h4>
            <div class="text-sm text-slate-500 leading-8">Data akan ditempatkan di Pusat Data Nasional sehingga lebih aman dan sekolah tidak lagi memerlukan komputer fisik serta perawatannya.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Free Maintenance</h4>
            <div class="text-sm text-slate-500 leading-8">Anda akan mendapatkan pembaruan berkala jika ada secara gratis dan kami akan melakukan backup seluruh data Anda secara berkala.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Instalasi</h4>
            <div class="text-sm text-slate-500 leading-8">Anda tak perlu bingung aplikasinya harus diapakan. Kami akan melakukan konfigurasi dan instalasi hingga dapat digunakan dan berjalan dengan semestinya.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Pelatihan Penggunaan</h4>
            <div class="text-sm text-slate-500 leading-8">Handbook selalu tersedia untuk membantu pengguna menjalankan aplikasi. Kami juga dapat memberikan pelatihan intensif dengan kondisi dan syarat tertentu.</div>
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex flex-col gap-4 items-center mobile:items-start">
    <h3 class="text-3xl text-primary font-medium">Mengapa Membuat Aplikasi bersama TakoTekno?</h3>
    <div class="w-24 h-1 bg-primary rounded-full mt-4 mb-8"></div>
    <div class="flex flex-wrap gap-10 w-full">
        @foreach ($whys as $item)
            <div class="flex flex-col gap-2 shadow-xl rounded-lg p-6 grow basis-80">
                {!! $item['icon'] !!}
                <h4 class="text-xl text-slate-600 font-medium mt-2">{{ $item['title'] }}</h4>
                <div class="text-xs text-slate-500 leading-6">{{ $item['description'] }}</div>
            </div>
        @endforeach
    </div>
</div>

<div class="p-20 mobile:p-10">
    <div class="bg-[#5a4d70] text-white rounded-xl p-10 flex mobile:flex-col gap-10">
        <div class="flex flex-col grow gap-4 p-10">
            <h3 class="text-xl font-medium leading-10">Tingkatkan Mutu Layanan Pendidikan dan Buat Sekolah Anda Selangkah Lebih Maju Dengan Menerapkan Digitalisasi bersama TakoTekno</h3>
            <div class="flex mt-4">
                <a 
                    href="https://wa.me/6285159772902?text={{ urlencode('Halo, TakoTekno. Saya [NAMA_ANDA] dari [NAMA_SEKOLAH] ingin dibantu untuk membuat aplikasi PPDB Sekolah') }}" 
                    class="p-3 px-6 rounded-full border border-white font-bold text-sm bg-white text-primary">
                    Hubungi Kami
                </a>
            </div>
        </div>
        <img src="{{ asset('images/scrolling.gif') }}" alt="Laptop" class="h-64 rounded-xl">
    </div>
</div>

@include('components.wa')

@endsection