@extends('layouts.age')

@section('title', "Advertising -")
    
@section('content')
<div class="w-full bg-cover bg-center relative aspect-[5/2] mobile:aspect-square" style="background-image: url({{ asset('images/age/ktf.jpg') }}); ">
    <div class="absolute top-0 left-0 right-0 bottom-0 p-20 mobile:p-10 backdrop-blur-sm bg-black/40 text-white flex flex-col gap-4 justify-center">
        <div class="text-xs">Advertising</div>
        <h2 class="text-5xl mobile:text-xl font-medium mb-6 leading-[64px] mobile:leading-[32px]">Tampil Lebih Banyak dan <br />Jangkau Audiens Lebih Luas</h2>
        <div class="w-7/12 mobile:w-full mobile:text-sm leading-8">Dapatkan audiens lebih banyak dengan visualisasi terbaik dan penempatan yang tepat.</div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex flex-col gap-8">
    <h3 class="text-3xl mobile:text-xl font-medium">Dokumentasi dan Visualisasi yang Mampu Berkomunikasi</h3>
    <div class="w-24 h-2 bg-orange-500 rounded-full"></div>
    <div class="text-slate-700 mobile:text-sm mobile:text-slate-600 leading-[36px] mobile:leading-[36px]">Sampaikan pesan Anda kepada audiens melalui visualisasi yang baik agar mudah dimengerti. Kami membantu Anda mendokumentasikan pesan Anda dan menyampaikannya kepada audiens yang tepat sehingga dapat terkomunikasikan dengan baik. Ini dapat membantu event Anda menjangkau peserta potensial lebih luas.</div>

    <div class="flex mobile:flex-col flex-wrap items-start gap-8">
        <div class="flex flex-col gap-4 p-4 rounded-lg border border-b-8 basis-3/12 grow">
            <img src="{{ asset('images/age/photo-video.png') }}" alt="Dokumentasi" class="w-full aspect-video object-cover rounded-lg">
            <h4 class="text-lg text-slate-600">Dokumentasi Foto & Video</h4>
        </div>
        <div class="flex flex-col gap-4 p-4 rounded-lg border border-b-8 basis-3/12 grow">
            <img src="{{ asset('images/age/vertical-banner.jpg') }}" alt="Vert Banner" class="w-full aspect-video object-cover rounded-lg">
            <h4 class="text-lg text-slate-600">Vertical Banner</h4>
        </div>
        <div class="flex flex-col gap-4 p-4 rounded-lg border border-b-8 basis-3/12 grow">
            <img src="{{ asset('images/age/spanduk.jpg') }}" alt="Spanduk" class="w-full aspect-video object-cover rounded-lg">
            <h4 class="text-lg text-slate-600">Spanduk</h4>
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex flex-col gap-8">
    <h3 class="text-3xl mobile:text-xl font-medium">Komunikasikan di Tempat yang Tepat</h3>
    <div class="w-24 h-2 bg-orange-500 rounded-full"></div>
</div>

@include('age.components.footer')
@endsection