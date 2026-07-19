@extends('layouts.page')

@section('title', "Warung Kopi")

@section('content')
<section class="w-full aspect-[5/2] mobile:aspect-[9/16] relative">
    <img src="/images/warkop.jpg" alt="Warkop" class="w-full aspect-[5/2] mobile:aspect-[9/16] object-cover object-bottom">
    <div class="absolute top-0 left-0 right-0 bottom-0 p-20 mobile:p-8 bg-black/40 text-white flex flex-col justify-end gap-4">
        <h2 class="text-5xl mobile:text-3xl font-medium mobile:leading-[48px]">
            Bisnis Warung Kopi Tidak Semudah Ngopi.
        </h2>
        <div>
            Ulasan negatif di Google, karyawan sering telat, stok hilang nggak jelas.
        </div>
    </div>
</section>

<section class="">
    <div class="flex items-center gap-4 p-20 mobile:p-8 pb-8">
        <h3 class="text-3xl mobile:text-xl text-slate-800 font-medium">Kalau ini sering terjadi<br />di warkopmu...</h3>
        <div class="flex grow"></div>
        {{-- <a href="{{ route('blog.category', $sect->slug) }}" class="text-slate-800 font-medium">LAINNYA</a> --}}
    </div>
    <div class="flex items-start gap-8 px-20 mobile:px-8 overflow-x-auto w-full">
        <a href="#" class="flex flex-col shrink basis-86 min-w-[360px] mobile:min-w-[240px] gap-2">
            <img src="/images/warkop-2.jpeg" alt="Warkop 2" class="w-full aspect-[16/9] rounded-lg object-cover bg-white">
            <h4 class="text-lg mobile:text-sm text-slate-800 font-medium mt-4">Stok sering miss.</h4>
        </a>
        <a href="#" class="flex flex-col shrink basis-86 min-w-[360px] mobile:min-w-[240px] gap-2">
            <img src="/images/warkop-2.jpeg" alt="Warkop 2" class="w-full aspect-[16/9] rounded-lg object-cover bg-white">
            <h4 class="text-lg mobile:text-sm text-slate-800 font-medium mt-4">Lorem ipsum</h4>
        </a>
        <a href="#" class="flex flex-col shrink basis-86 min-w-[360px] mobile:min-w-[240px] gap-2">
            <img src="/images/warkop-2.jpeg" alt="Warkop 2" class="w-full aspect-[16/9] rounded-lg object-cover bg-white">
            <h4 class="text-lg mobile:text-sm text-slate-800 font-medium mt-4">Lorem ipsum</h4>
        </a>
        <a href="#" class="flex flex-col shrink basis-86 min-w-[360px] mobile:min-w-[240px] gap-2">
            <img src="/images/warkop-2.jpeg" alt="Warkop 2" class="w-full aspect-[16/9] rounded-lg object-cover bg-white">
            <h4 class="text-lg mobile:text-sm text-slate-800 font-medium mt-4">Lorem ipsum</h4>
        </a>
    </div>
</section>

<div class="h-8"></div>
@endsection