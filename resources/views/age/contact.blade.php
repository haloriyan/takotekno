@extends('layouts.age')

@section('title', "Contact Us -")
    
@section('content')
<div class="p-20 mobile:p-10 flex mobile:flex-col items-start gap-10">
    <div class="flex flex-col gap-4 grow mobile:w-full">
        <div class="w-32 mobile:w-24 h-2 mobile:h-1 bg-orange-500 rounded-full"></div>
        <h2 class="text-5xl mobile:text-2xl font-medium leading-[72px]">Contact Us</h2>
        <form>
            @csrf
            <div class="flex mobile:flex-col items-start gap-8">
                <div class="flex flex-col gap-2 grow mobile:w-full">
                    <div class="text-sm text-slate-600">Nama</div>
                    <input type="text" class="w-full h-14 outline-0 px-4 bg-slate-200 text-sm">
                </div>
                <div class="flex flex-col gap-2 grow mobile:w-full">
                    <div class="text-sm text-slate-600">Kontak</div>
                    <input type="text" class="w-full h-14 outline-0 px-4 bg-slate-200 text-sm" placeholder="Email atau No. WhatsApp">
                </div>
            </div>
            <div class="flex flex-col gap-2 grow mt-8">
                <div class="text-sm text-slate-600">Deskripsikan Kebutuhan Anda</div>
                <textarea rows="8" class="w-full outline-0 px-4 bg-slate-200 text-sm"></textarea>
            </div>
            <div class="flex justify-end mt-8">
                <button class="font-medium bg-primary p-3 px-8 text-white rounded-full">
                    Kirim
                </button>
            </div>
        </form>
    </div>
    <div class="flex flex-col gap-4 w-5/12 mobile:w-full">
        <div class="w-32 mobile:w-24 h-2 mobile:h-1 bg-orange-500 rounded-full"></div>
        <h2 class="text-5xl mobile:text-2xl font-medium leading-[72px] mb-6">Reach Us on</h2>
        <a href="#" class="flex items-center gap-4 border rounded-full p-4 px-8">
            <ion-icon name="logo-instagram" class="text-2xl"></ion-icon>
            <div class="text-sm">@agecreative.id</div>
        </a>
        <a href="#" class="flex items-center gap-4 border rounded-full p-4 px-8">
            <ion-icon name="call-outline" class="text-2xl"></ion-icon>
            <div class="text-sm">+62 812 3456 7890</div>
        </a>
        <a href="#" class="flex items-center gap-4 border rounded-full p-4 px-8">
            <ion-icon name="mail-outline" class="text-2xl"></ion-icon>
            <div class="text-sm">halo@agecreative.id</div>
        </a>
    </div>
</div>

<div class="p-20 mobile:p-10 pb-0 flex flex-col gap-8">
    <div class="w-32 mobile:w-24 h-2 mobile:h-1 bg-orange-500 rounded-full"></div>
    <h2 class="text-5xl font-medium leading-[72px] mb-6">Find Us</h2>
</div>

<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.2437804329734!2d112.7057901!3d-7.438256099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e1004f511965%3A0xe19959c42dcc9195!2sAgecreative!5e0!3m2!1sen!2sid!4v1736675748687!5m2!1sen!2sid" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

{{-- <div class="h-16"></div> --}}

@include('age.components.footer')
@endsection