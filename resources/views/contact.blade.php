@extends('layouts.page')

@section('title', "Hubungi Kami")
    
@section('content')

<div class="p-20 mobile:p-8 grid grid-cols-2 mobile:grid-cols-1 gap-20">
    <form action="#" method="POST" class="flex flex-col gap-4">
        @csrf
        <h2 class="text-4xl text-slate-800 font-medium">Hubungi Kami</h2>
        <div class="w-full">
            <div class="text-xs text-slate-800 font-medium">Nama</div>
            <input type="text" class="border rounded-lg px-4 w-full h-14 mt-2 outline-none" required>
        </div>
        <div class="w-full">
            <div class="text-xs text-slate-800 font-medium">Email</div>
            <input type="text" class="border rounded-lg px-4 w-full h-14 mt-2 outline-none" required>
        </div>
        <div class="w-full">
            <div class="text-xs text-slate-800 font-medium">Pesan</div>
            {{-- <input type="text" class="border rounded-lg px-4 w-full h-14 mt-2 outline-none"> --}}
            <textarea name="body" id="body" class="border rounded-lg p-4 w-full mt-2 outline-none" rows="10" required></textarea>
        </div>

        <div class="flex justify-end">
            <button class="p-3 px-5 rounded-lg bg-primary text-white text-sm font-medium">
                Kirim
            </button>
        </div>
    </form>
    <div class="flex flex-col gap-4">
        <a href="mailto:halo@takotoko.com" class="flex items-center gap-4 shadow-md bg-white p-6 rounded-lg">
            <div class="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg">
                <ion-icon name="mail-outline" class="text-3xl"></ion-icon>
            </div>
            <div class="flex flex-col gap-2">
                <div class="text-xs text-slate-500">Email</div>
                <div class="text-slate-800 font-medium">halo@takotoko.com</div>
            </div>
        </a>
        <a href="https://wa.me/6285159772902" class="flex items-center gap-4 shadow-md bg-white p-6 rounded-lg" target="_blank">
            <div class="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg">
                <ion-icon name="logo-whatsapp" class="text-3xl"></ion-icon>
            </div>
            <div class="flex flex-col gap-2">
                <div class="text-xs text-slate-500">WhatsApp</div>
                <div class="text-slate-800 font-medium">+62 851 5977 2902</div>
            </div>
        </a>
    </div>
</div>

@endsection