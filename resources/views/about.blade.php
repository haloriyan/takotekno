@extends('layouts.page')

@section('title', "Tentang Kami -")
    
@section('content')
<div class="bg-primary text-white p-20 py-56 flex gap-20 relative">
    <div class="w-7/12 flex flex-col gap-6">
        <h2 class="text-4xl font-medium" style="line-height: 64px">
            Partner Digital Anda untuk Solusi Terbaik
        </h2>
        <div class="leading-8 text-lg">
            Kami di Takotekno berkomitmen untuk membawa bisnis Anda ke level berikutnya dengan inovasi, kreativitas, dan teknologi terkini
        </div>
    </div>
    <div class="flex grow"></div>
</div>

<div class="p-20 mobile:p-10 flex items-center mobile:flex-col-reverse gap-20 mobile:gap-10">
    <div class="flex flex-col w-6/12 mobile:w-full gap-8">
        <div class="w-24 h-1 bg-primary"></div>
        <h3 class="text-2xl mobile:text-lg text-slate-700 mb-2">Tentang Kami</h3>
        <p class="text-slate-500 mobile:text-sm leading-8 mobile:leading-8">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta rem aperiam quo voluptates quis fugit perferendis quaerat odio, consequuntur repellat? Inventore atque veritatis consectetur exercitationem numquam magnam. Animi, tempora hic?
        </p>
    </div>
    <div class="flex grow"></div>
    <div class="flex grow justify-end w-1/12">
        {{-- <img src="{{ asset('images/icon.png') }}" alt="Coding" class="w-full aspect-square object-cover rounded-xl"> --}}
    </div>
</div>

<div class="flex gap-8 p-20 justify-center">
    <div class="flex flex-col gap-4 grow items-center">
        <div class="text-slate-600">VISI</div>
        <div class="text-primary text-3xl font-bold">FOYA</div>
    </div>
    <div class="flex flex-col gap-4 grow items-center">
        <div class="text-slate-600">MISI</div>
        <div class="text-primary text-3xl font-bold">FOYA</div>
    </div>
</div>

<div class="p-20 flex justify-center pt-2">
    <h4 class="text-4xl font-bold text-primary text-center w-8/12 mobile:w-full">Jadi Visi Misi Kami adalah Membantu Anda Foya-Foya Tetapi Bisnis Tetap Jalan</h4>
</div>

@include('components.clients')
@include('components.cta')

@endsection