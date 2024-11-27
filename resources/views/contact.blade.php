@extends('layouts.page')

@section('title', "Hubungi Kami -")
    
@section('content')
<div class="heightToScreen flex flex-col gap-8 mobile:gap-4 items-start justify-center p-20 desktop:pt-28 px-72 mobile:p-10">
    <div class="w-36 mobile:w-20 h-1 bg-primary"></div>
    <h1 class="text-5xl mobile:text-3xl text-primary">Hubungi Kami</h1>

    <form class="w-full" action="{{ route('contact.submit') }}" method="POST">
        @csrf
        <div class="flex mobile:flex-col gap-4">
            <div class="flex flex-col gap-2 grow">
                <div class="text-primary">Nama</div>
                <input name="name" type="text" class="w-full bg-slate-200 h-16 px-6 outline-0" required>
            </div>
            <div class="flex flex-col gap-2 grow">
                <div class="text-primary">Kontak</div>
                <input name="contact" type="text" class="w-full bg-slate-200 h-16 px-6 outline-0" required>
                <div class="text-slate-500 text-xs text-right">
                    Email atau No. WhatsApp
                </div>
            </div>
        </div>

        <div class="text-primary">Layanan</div>
        <select name="layanan" required class="w-full bg-slate-200 h-16 px-6 outline-0 mt-2">
            <option value="">Pilih Layanan</option>
            <option value="App Development">App Development</option>
            <option value="Digital Ads Management">Digital Ads Management</option>
        </select>

        <div class="text-primary mb-2 mt-4 mobile:mt-8">Deskripsikan Kebutuhan Anda</div>
        <textarea name="message" class="w-full bg-slate-200 outline-0 h-52"></textarea>

        @if ($message != "")
        <div class="bg-green-200 text-green-700 p-4 px-6 rounded-lg mt-4">
            {{ $message }}
        </div>
        @endif

        <div class="flex justify-end mt-4">
            <button class="p-3 px-6 bg-primary text-white font-medium">
                SUBMIT
            </button>
        </div>
    </form>
</div>

<div class="p-20">
    <div class="text-2xl text-slate-600">atau Anda dapat menghubungi Kami di</div>
    <div class="flex gap-8 mt-10">
        <a href="mailto:halo@takotekno.com" class="shadow-lg p-8 rounded-xl flex flex-1 items-center gap-8">
            <ion-icon name="mail-outline" class="text-4xl"></ion-icon>
            <div class="flex flex-col gap-2">
                <div class="text-slate-700 font-medium">Email</div>
                <div class="text-sm text-slate-500">halo@takotekno.com</div>
            </div>
        </a>
        <a href="https://wa.me/6285159772902" class="shadow-lg p-8 rounded-xl flex flex-1 items-center gap-8">
            <ion-icon name="logo-whatsapp" class="text-4xl"></ion-icon>
            <div class="flex flex-col gap-2">
                <div class="text-slate-700 font-medium">WhatsApp</div>
                <div class="text-sm text-slate-500">+62 851 5977 2902</div>
            </div>
        </a>
        <a href="#" class="shadow-lg p-8 rounded-xl flex flex-1 items-center gap-8">
            <ion-icon name="location-outline" class="text-4xl"></ion-icon>
            <div class="flex flex-col gap-2">
                <div class="text-slate-700 font-medium">Lokasi</div>
                <div class="text-sm text-slate-500">Perumahan Jaya Regency Blok BF-20, Sedati, Sidoarjo, Jawa Timur</div>
            </div>
        </a>
    </div>
</div>
@endsection