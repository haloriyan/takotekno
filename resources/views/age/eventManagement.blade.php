@extends('layouts.age')

@section('title', "Event Management -")
    
@section('content')
<div class="w-full bg-cover bg-center relative aspect-[5/2] mobile:aspect-square" style="background-image: url({{ asset('images/age/vwe-2.jpg') }});">
    <div class="absolute top-0 left-0 right-0 bottom-0 p-20 mobile:p-10 backdrop-blur-sm bg-black/30 text-white flex flex-col gap-4 justify-center">
        <div class="text-xs">Event Management</div>
        <h2 class="text-5xl mobile:text-xl font-medium mb-6">Buat Event yang <i>Worry-Free</i></h2>
        <div class="w-7/12 mobile:w-full mobile:text-sm leading-8">Konsultasi dan Sisanya Serahkan Pada Kami. Wujudkan Acara yang Tak Pernah Anda begitu Kagumi sebelumnya.</div>
    </div>
</div>

<div class="p-20 mobile:p-10 pb-0">
    <h3 class="text-3xl text-primary font-medium">Solusi Lengkap untuk Event Profesional</h3>
    <div class="text-slate-600 leading-[38px] mt-8">
        Kami membantu Anda dalam menyelenggarakan event baik berskala besar maupun untuk internal perusahaan. Didukung dengan mitra kami yang ada di seluruh Indonesia, kami memastikan event Anda akan terselenggara dengan sangat baik di manapun lokasi event yang akan diadakan.
        Dijalankan oleh talenta-talenta profesional dan berpengalaman di bidangnya, event Anda akan termanage dengan sangat rapi beserta pelaporan yang lengkap.
    </div>
</div>

<div class="p-20 mobile:p-10 pt-10 flex mobile:flex-col gap-20 mobile:gap-10">
    <div class="flex flex-col gap-4 grow border rounded-xl p-10 border-b-8">
        <div class="text-3xl font-bold">79+</div>
        <div class="text-sm text-slate-500">Event Terselenggara</div>
    </div>
    <div class="flex flex-col gap-4 grow border rounded-xl p-10 border-b-8">
        <div class="text-3xl font-bold">9</div>
        <div class="text-sm text-slate-500">Kota di Indonesia</div>
    </div>
    <div class="flex flex-col gap-4 grow border rounded-xl p-10 border-b-8">
        <div class="text-3xl font-bold">45</div>
        <div class="text-sm text-slate-500">Mitra Penyelenggara</div>
    </div>
</div>

@php
    $eventTypes = ["Exhibition", "Music Festival", "Brand Activation", "Product Launching", "Gathering", "Seminar", "Sport & Activities", "Talkshow", "Competition"];
    $vendors = [
        [
            'icon' => "storefront-outline",
            'label' => "Booth Design"
        ],
        [
            'icon' => "construct-outline",
            'label' => "Rigging & Stage"
        ],
        [
            'icon' => "images-outline",
            'label' => "Media & Advertising"
        ],
        [
            'icon' => "volume-high-outline",
            'label' => "Lightning & Sound System"
        ],
        [
            'icon' => "tv-outline",
            'label' => "LED Screen & Videotron"
        ],
        [
            'icon' => "flash-outline",
            'label' => "Genset & Electricity Support"
        ],
        [
            'icon' => "wifi-outline",
            'label' => "Internet & Connectivity"
        ],
        [
            'icon' => "hardware-chip-outline",
            'label' => "Table & Chair"
        ],
        [
            'icon' => "bag-handle-outline",
            'label' => "Merchandise"
        ],
    ];
@endphp

<div class="h-[380px] mobile:h-[800px] bg-cover relative" style="background-image: url({{ asset('images/age/ktf-2.jpg') }});">
    <div class="absolute top-0 left-0 right-0 bottom-0 backdrop-blur-lg bg-black/40 text-white p-20 mobile:p-10 flex mobile:flex-col items-start gap-20 mobile:gap-10">
        <div class="flex flex-col gap-8">
            <h3 class="text-3xl font-medium leading-[42px]">Lebih dari 6 Tahun Berpengalaman dengan Berbagai Event</h3>
            <div class="leading-8">Berdiri sejak tahun 2018 dan dibangun bersama talenta berpengalaman di event organizer ternama di Surabaya, kami telah menjalankan puluhan event dengan berbagai tema dan kebutuhan yang beragam.</div>
        </div>
        <div class="flex flex-wrap desktop:grow items-center gap-6 mobile:gap-4 rounded-lg text-slate-700">
            @foreach ($eventTypes as $item)
                <div class="bg-white/30 text-white rounded-full p-3 px-6 flex items-center gap-4 text-sm mobile:text-xs">
                    {{ $item }}
                </div>
            @endforeach
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex flex-col gap-8 items-center">
    <h3 class="text-slate-700 text-3xl text-center font-medium">Dukungan Vendor untuk Kebutuhan Event Anda</h3>
    <div class="w-32 h-2 bg-orange-500 rounded-full"></div>
    <div class="flex flex-wrap grow desktop:items-start justify-center gap-8 mobile:gap-4">
        @foreach ($vendors as $vendor)
            <div class="bg-white rounded-xl shadow-lg p-8 mobile:p-4 flex flex-col basis-2/12 grow gap-4 items-center">
                <ion-icon class="text-3xl" name="{{ $vendor['icon'] }}"></ion-icon>
                <div class="text-xs mobile:text-center">{{ $vendor['label'] }}</div>
            </div>
        @endforeach
    </div>
</div>

@include('age.components.footer')
@endsection

@section('javascript')
<script>
    // 
</script>
@endsection