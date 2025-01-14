@extends('layouts.age')

@section('title', "About - ")
    
@section('content')
<div class="p-20 py-48 mobile:py-20 flex flex-col items-center gap-4">
    <div class="w-32 h-2 bg-orange-500 rounded-full"></div>
    <h2 class="text-5xl mobile:text-2xl font-medium text-center leading-[72px] mobile:leading-[48px]">Kreatifitas yang <i class="underline">Long-lasting</i> untuk Mencapai Puncak Kesuksesan Bersama</h2>
    <div class="text-slate-600 text-center leading-8 w-8/12 mobile:w-full text-sm mobile:text-xs mobile:leading-[32px]">
        AGE Creative merupakan unit bisnis dari CV Anugrah Gemilang Erajaya yang bergerak di bidang 
        <span class="text-orange-500">Event Organizer</span>,
        <span class="text-orange-500">Creative Agency</span>,
        <span class="text-orange-500">Konstruksi Booth</span>, dan juga
        <span class="text-orange-500">Dekorasi Interior</span> untuk kantor dan rumah
    </div>
</div>

<div class="flex mobile:flex-col gap-20 mobile:gap-10 p-20 mobile:p-10 relative">
    <div class="flex flex-col grow gap-6">
        <h3 class="text-2xl font-medium">Tentang Kami</h3>
        <div class="flex mb-4">
            <div class="w-24 h-1 rounded-full bg-orange-500"></div>
        </div>
        <div class="text-slate-600 mobile:text-sm leading-8 mobile:leading-[28px]">AGE Creative bermakna bahwa kreatifitas memiliki sifat Long-lasting dan wajib dimiliki setiap perusahaan dalam berkompetisi seiring dengan perkembangan jaman. Dan kami pun berkomitmen serta konsisten mendukung era yang dinamis ini.</div>
        <div class="text-slate-600 mobile:text-sm leading-8 mobile:leading-[28px]">
            Sedangkan, lambang logo kami merupakan manifestasi makna dari <i class="text-orange-500 underline">Art</i> bahwa di setiap pekerjaan yang kami lakukan juga mengedepankan unsur estetika. Selain itu, juga memiliki simbol <i class="underline text-orange-500">Piramida</i> dimana kami ingin mencapai puncak kesuksesan dan memberikan asas manfaat positif bersama-sama dengan Anda.
        </div>
    </div>
    <img src="{{ asset('images/age/vwe.jpg') }}" alt="Foto" class="rounded-xl object-cover w-4/12 mobile:w-full">

    <div class="absolute top-0 left-0 right-0 opacity-75">
        <img src="{{ asset('images/age/union.png') }}" alt="Union" class="w-full">
    </div>
</div>

<div class="p-20 py-24 mobile:p-10 flex flex-col items-center gap-4">
    <div class="text-orange-500 text-lg">Visi & Misi Kami</div>
    <div class="w-24 h-1 bg-orange-500 rounded-full"></div>
    <h2 class="text-5xl mobile:text-2xl font-medium text-center leading-[72px] mobile:leading-[48px]">Menjadi Penyedia Layanan Event dan Solusi bagi Industri Kreatif yang Dapat Diandalkan</h2>
    <div class="flex mobile:flex-col items-start gap-8 mt-8">
        <div class="bg-white rounded-xl shadow-lg p-8 flex basis-4/12 mobile:w-full mobile:grow">
            <div class="text-slate-700 leading-8">Konsisten memberikan jasa layanan event yang kredibel dan berkompeten.</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-8 flex basis-4/12 mobile:w-full mobile:grow">
            <div class="text-slate-700 leading-8">Membantu dalam pencapaian tujuan dan target perusahaan klien pada sektor kegiatan branding maupun selling.</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-8 flex basis-4/12 mobile:w-full mobile:grow">
            <div class="text-slate-700 leading-8">Menciptakan nilai lebih bagi para stakeholder serta mendukung pertumbuhan ekonomi bangsa.</div>
        </div>
    </div>
</div>


@include('age.components.footer')
@endsection