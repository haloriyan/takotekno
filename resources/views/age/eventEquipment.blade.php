@extends('layouts.age')

@section('title', "Event Equipment -")
    
@section('content')
<div class="w-full bg-cover bg-center relative aspect-[5/2] mobile:aspect-square" style="background-image: url({{ asset('images/age/vwe-2.jpg') }});">
    <div class="absolute top-0 left-0 right-0 bottom-0 p-20 mobile:p-10 backdrop-blur-sm bg-black/30 text-white flex flex-col gap-4 justify-center">
        <div class="text-xs">Event Equipment</div>
        <h2 class="text-5xl mobile:text-xl font-medium mb-6 leading-[64px]">Pengalaman Terbaik <br />Didukung dengan Peralatan Lengkap</h2>
        <div class="w-7/12 mobile:w-full mobile:text-sm leading-8">Selalu siap dalam segala kebutuhan dan peralatan event Anda.</div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10 relative bg-contain bg-no-repeat bg-bottom">
    <div class="flex flex-col gap-4 w-8/12 mobile:w-full grow">
        <h3 class="text-4xl mobile:text-xl font-bold leading-[54px]">SALING SINERGI <br />DENGAN KOMUNIKASI YANG <i>SEAMLESS</i>.</h3>
        <div class="w-[200px] h-2 bg-orange-500 rounded-full"></div>
        <div class="mobile:text-sm text-slate-600 leading-[36px] mobile:leading-[28px] mt-8 mobile:mt-2">
            Komunikasi untuk bekerja sama dalam menyukseskan event Anda melalui walkie talkie dengan jangkauan yang luas dan suara yang jernih.
        </div>
    </div>
    <img src="{{ asset('images/age/ht.jpg') }}" alt="HT" class="w-4/12 mobile:w-full aspect-square object-cover rounded-xl" />
</div>

<div class="w-full aspect-[5/2] mobile:aspect-square relative bg-cover bg-fixed" style="background-image: url({{ asset('images/age/stage.jpg') }})">
    <div class="absolute top-0 left-0 right-0 bottom-0 bg-black/60 mobile:bg-black/30 backdrop-blur-sm text-white p-20 mobile:p-10 flex flex-col gap-8 items-center justify-center">
        <h3 class="text-5xl mobile:text-3xl w-7/12 mobile:w-full font-bold leading-[72px]">HADIRKAN PENGALAMAN PALING MEMUKAU DENGAN<br/>VISUALISASI DAN SISTEM AUDIO TERBAIK.</h3>
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10 relative bg-contain bg-no-repeat bg-bottom">
    <div class="flex flex-col gap-4 w-8/12 mobile:w-full grow">
        <h3 class="text-4xl mobile:text-xl font-bold leading-[54px]">KONEKTIVITAS PALING STABIL UNTUK <i>ENTERTAINMENT SYSTEM</i>.</h3>
        <div class="w-[200px] h-2 bg-orange-500 rounded-full"></div>
        <div class="mobile:text-sm text-slate-600 leading-[36px] mobile:leading-[28px] mt-8 mobile:mt-2">
            Maksimalkan <i>entertainment system</i> Anda dengan konektivitas internet yang stabil
        </div>
    </div>
    <img src="{{ asset('images/age/ht.jpg') }}" alt="HT" class="w-4/12 mobile:w-full aspect-square object-cover rounded-xl" />
</div>

@php
    $vendors = [
        [
            'icon' => "tv-outline",
            'label' => "LED Screen & Videotron"
        ],
        [
            'icon' => "wifi-outline",
            'label' => "Internet & Connectivity"
        ],
        [
            'icon' => "volume-high-outline",
            'label' => "Lightning & Sound System"
        ],
        [
            'icon' => "beaker-outline",
            'label' => "AC & Temperature System"
        ],
        [
            'icon' => "flash-outline",
            'label' => "Genset & Electricity Support"
        ],
        [
            'icon' => "storefront-outline",
            'label' => "Sarnafil Tent"
        ],
        [
            'icon' => "phone-portrait-outline",
            'label' => "Walkie Talkie"
        ],
    ];
@endphp

<div class="p-20 mobile:p-10 flex flex-col gap-8 items-center">
    <h3 class="text-slate-700 text-3xl text-center font-medium">Hadir dalam Segala Kebutuhan Event Anda</h3>
    <div class="w-32 h-2 bg-orange-500 rounded-full"></div>
    <div class="flex flex-wrap grow justify-center gap-8 mobile:gap-4">
        @foreach ($vendors as $vendor)
            <div class="bg-white rounded-xl shadow-lg p-10 mobile:p-4 flex flex-col basis-2/12 grow gap-4 items-center">
                <ion-icon class="text-5xl" name="{{ $vendor['icon'] }}"></ion-icon>
                <div class="text-xs text-center">{{ $vendor['label'] }}</div>
            </div>
        @endforeach
    </div>
</div>
@include('age.components.footer')
@endsection