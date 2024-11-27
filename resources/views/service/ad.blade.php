@extends('layouts.page')

@section('title', "Digital Ads Management - ")
    
@section('content')
<div class="bg-green-500 text-white p-20 py-56 mobile:p-10 mobile:py-36 flex gap-20 relative">
    <div class="w-7/12 mobile:w-full flex flex-col gap-6">
        <h2 class="text-4xl mobile:text-xl mobile:leading-10 font-medium">
            Dapatkan Lebih Banyak Traffic dengan Iklan Berbasis Data di Platform Meta dan Google
        </h2>
        <div class="leading-8  text-lg mobile:text-sm">
            Kami mengoptimalkan setiap kampanye dengan analisis mendalam, penargetan yang tepat, dan kreativitas yang menarik untuk memastikan anggaran Anda menghasilkan hasil maksimal
        </div>
        <div class="flex">
            <a href="{{ route('contact') }}" class="bg-white text-green-500 p-4 px-8 rounded-full">Hubungi Kami</a>
        </div>
    </div>
    <div class="flex grow"></div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10">
    <div class="flex flex-col gap-8 max-w-96">
        <h3 class="text-4xl text-slate-700 font-medium">Dapatkan Traffic Secara Instan untuk Berbagai Tujuan</h3>
        @include('components.dots', [
            'width' => 6,
            'height' => 3,
            'color' => "bg-green-500"
        ])
    </div>
    <div class="flex flex-col gap-4 grow">
        @foreach ($types as $item)
            <div class="flex items-center gap-4 border rounded-lg p-8">
                {!! $item['icon'] !!}
                <div class="flex flex-col grow gap-2">
                    <div class="text-slate-700">{{ $item['title'] }}</div>
                </div>
            </div>
        @endforeach
    </div>
</div>

<div class="p-20 mobile:p-10">
    <div class="w-24 h-1 bg-green-500"></div>
    <h3 class="text-4xl text-green-500 mt-10">Rencanakan Kesuksesan Anda</h3>
    <div class="flex mobile:flex-col gap-8 mt-20">
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="chatbubbles-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Diskusikan</h4>
            <div class="text-slate-600 text-sm text-center">Beri tahu kami tujuan yang ingin Anda capai</div>
        </div>
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="bulb-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Brainstorming</h4>
            <div class="text-slate-600 text-sm text-center">Kami merencanakan kampanye dengan penargetan yang sesuai dengan tujuan Anda</div>
        </div>
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="cloud-upload-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Jalankan</h4>
            <div class="text-slate-600 text-sm text-center">Mulai tayangkan kampanye sesuai dengan brief yang telah disepakati</div>
        </div>
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="bar-chart-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Terima Laporan</h4>
            <div class="text-slate-600 text-sm text-center">Terima hasil statistik langsung dari platform jaringan periklanan</div>
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col items-center gap-10">
    <div class="flex flex-col gap-4">
        <div class="text-slate-600">Berapa biaya yang harus dikeluarkan?</div>
        <h3 class="text-4xl text-green-500">Bebas! Menyesuaikan kebutuhan dan persaingan</h3>
        <div class="text-xs text-slate-500">dengan Fee sebesar Rp 250.000 per kampanye per bulan</div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10">
    <div class="flex flex-col gap-8 min-w-96 mobile:w-full">
        <h3 class="text-4xl text-slate-700 font-medium">Pertanyaan Umum</h3>
        <div class="text-slate-500 text-sm">Pertanyaan yang mungkin ingin Anda sampaikan</div>
    </div>
    <div class="flex flex-col gap-4 grow">
        @foreach ($faqs as $f => $faq)
            <div class="border rounded-xl p-6 flex flex-col gap-4 cursor-pointer" onclick="toggleFaq(this)">
                <div class="flex items-center gap-4">
                    <div class="flex grow text-slate-700">{{ $faq['question'] }}</div>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                </div>
                <div class="text-slate-500 text-sm {{ $f != 0 ? 'hidden' : ''}} faq-answer">{{ $faq['answer'] }}</div>
            </div>
        @endforeach
    </div>
</div>

@include('components.cta')
@endsection