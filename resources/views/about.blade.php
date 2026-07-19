@extends('layouts.page')

@section('title', "Tentang")
    
@section('content')

<div class="p-20 mobile:p-8 flex flex-col gap-4 items-center">
    <div class="w-8/12 mobile:w-full flex flex-col items-center gap-4 text-center">
        <div class="h-24 desktop:hidden"></div>
        <img src="/images/tt.png" alt="icon" class="h-32 w-32 mobile:w-16 mobile:h-16">
        <h2 class="text-4xl mobile:text-xl text-slate-800 font-medium leading-[48px] mt-4">POS yang benar-benar membantu jualan, bukan bikin semakin ribet.</h2>
        <div class="text-lg mobile:text-sm text-slate-600 leading-[32px] mobile:leading-[24px]">
            Kami menyadari kalau aplikasi POS seringkali malah bikin penjual semakin ribet. Bingung cara pakainya gimana. Salah input data. Banyak Pokoknya.
        </div>

        <div class="flex items-center gap-4 mt-4">
            <a href="{{ env('GPLAY_URL') }}" class="p-3 px-5 rounded-lg bg-primary text-white mobile:text-sm font-medium" target="_blank">
                Unduh Aplikasi
            </a>
            <a href="{{ route('about.contact') }}" class="p-3 px-5 rounded-lg bg-white text-primary mobile:text-sm font-medium">
                Hubungi Kami
            </a>
        </div>

        <div class="h-24 desktop:hidden"></div>
    </div>
</div>

<section class="p-20 mobile:p-8 grid grid-cols-3 mobile:grid-cols-1 gap-20">
    <div class="flex flex-col gap-4 items-center text-center">
        <div>
            <ion-icon name="color-palette-outline" class="text-5xl"></ion-icon>
        </div>
        <h3 class="text-2xl text-slate-800 font-medium">Masalah yang Nyata.</h3>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Takotoko dirancang untuk menjawab keluhan pelaku UMKM dengan masalah mereka yang sebenarnya.
        </div>
    </div>
    <div class="flex flex-col gap-4 items-center text-center">
        <div>
            <ion-icon name="people-outline" class="text-5xl"></ion-icon>
        </div>
        <h3 class="text-2xl text-slate-800 font-medium">Pelatihan dan Berbagi</h3>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Mewadahi UMKM yang ingin meningkatkan skala usaha mereka melalui pengalaman yang terbukti.
        </div>
    </div>
    <div class="flex flex-col gap-4 items-center text-center">
        <div>
            <ion-icon name="cog-outline" class="text-5xl"></ion-icon>
        </div>
        <h3 class="text-2xl text-slate-800 font-medium">Dukungan Teknis Penuh</h3>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Memfasilitasi kendala teknis yang terjadi dalam aplikasi maupun di luar itu.
        </div>
    </div>
</section>

@include('partials.cta')

@endsection