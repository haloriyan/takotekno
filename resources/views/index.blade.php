@extends('layouts.page')

@section('head')
<style>
.logo-container {
  position: relative;
  width: 100%;
}

.logo-list {
  animation: scroll 20s linear infinite;
}

.logo-item {
  flex-shrink: 0;
}

.logo-container:hover .logo-list {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
@endsection

@section('content')
<div class="heightToScreen flex mobile:flex-col-reverse items-center justify-start gap-20 mobile:gap-10 p-20 mobile:p-10 bg-no-repeat bg-contain bg-right mobile:bg-top" style="background-image: url({{ asset('images/illus.png') }})">
    <div class="flex flex-col gap-4 w-7/12 mobile:w-full">
        <h2 class="text-4xl mobile:text-2xl font-bold text-primary leading-10">Empowering Businesses<br />with Technology and Creativity</h2>
        <p class="text-slate-600 text-lg mobile:text-sm leading-8">
            Takotekno menghadirkan solusi pengembangan perangkat lunak mutakhir dan pemasaran digital kreatif yang dirancang untuk kesuksesan Anda.
        </p>
        <div class="flex gap-4 mt-4">
            <button class="bg-primary text-white p-3 px-6 rounded-full font-medium text-sm">
                Kembangkan Bisnis Anda
            </button>
        </div>
    </div>
    <div class="flex grow hidden"></div>
</div>

<div class="p-20 mobile:p-10 pt-0 flex flex-col items-center gap-4">
    <div class="w-24 h-1 bg-primary mb-4"></div>
    <h3 class="text-2xl font-bold text-primary">Apa yang Bisa Anda Dapatkan dari Kami?</h3>
    <p class="text-slate-600">Intinya efisiensi dan memaksimalkan potensi keuntungan, melalui :</p>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col-reverse gap-40 mobile:gap-10">
    <div class="flex flex-col w-6/12 mobile:w-full gap-4">
        <div class="flex mb-6 mobile:hidden">
            <div class="h-24 aspect-square rounded-full bg-primary text-white flex items-center justify-center text-4xl">
                <ion-icon name="laptop-outline"></ion-icon>
            </div>
        </div>
        <div class="text-2xl mobile:text-lg text-slate-700">Pengembangan Perangkat Lunak Kustom untuk Aplikasi Web dan Mobile yang Skalabel dan Ramah Pengguna</div>
        <p class="text-slate-500 mobile:text-sm leading-8 mobile:leading-8">Kami menghadirkan solusi perangkat lunak kustom yang dirancang untuk menjawab tantangan bisnis Anda. Dengan aplikasi web dan mobile yang skalabel dan mudah digunakan, kami membantu menyederhanakan proses, meningkatkan efisiensi, dan menciptakan pengalaman pengguna yang maksimal.        </p>
        <div class="flex mobile:flex-col items-center mobile:items-start gap-4 mt-8">
            <a href="{{ route('contact') }}" class="p-3 px-6 rounded-full text-sm bg-primary text-white font-medium">Hubungi TakoTekno</a>
            <a href="{{ route('service.dev') }}" class="p-3 px-6 rounded-full text-sm border-primary text-primary ">Selengkapnya</a>
        </div>
    </div>
    <div class="flex grow justify-end">
        <img src="{{ asset('images/coding.svg') }}" alt="Coding" class="w-full aspect-square">
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col-reverse gap-40 mobile:gap-10">
    <div class="flex flex-col w-6/12 mobile:w-full gap-4">
        <div class="flex mb-6 mobile:hidden">
            <div class="h-24 aspect-square rounded-full bg-green-500 text-white flex items-center justify-center text-4xl">
                <ion-icon name="bar-chart-outline"></ion-icon>
            </div>
        </div>
        <div class="text-2xl mobile:text-lg text-slate-700">Maksimalkan ROI dengan Iklan Berbasis Data di Platform Meta dan Google</div>
        <p class="text-slate-500 mobile:text-sm leading-8 mobile:leading-8">Kami mengoptimalkan setiap kampanye dengan analisis mendalam, penargetan yang tepat, dan kreativitas yang menarik untuk memastikan anggaran Anda menghasilkan hasil maksimal. Dari kesadaran merek hingga konversi, kami membantu Anda mencapai tujuan pemasaran dengan ROI terbaik.</p>
        <div class="flex mobile:flex-col items-center mobile:items-start gap-4 mt-8">
            <a href="{{ route('contact') }}" class="p-3 px-6 rounded-full text-sm bg-green-500 text-white font-medium">Hubungi TakoTekno</a>
            <a href="{{ route('service.ad') }}" class="p-3 px-6 rounded-full text-sm border-green-500 text-green-500 ">Selengkapnya</a>
        </div>
    </div>
    <div class="flex grow justify-end">
        <img src="{{ asset('images/campaign.svg') }}" alt="Campaign" class="w-full aspect-square">
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col-reverse gap-40 mobile:gap-10">
    <div class="flex flex-col w-6/12 mobile:w-full gap-4">
        <div class="flex mb-6 mobile:hidden">
            <div class="h-24 aspect-square rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl">
                <ion-icon name="create-outline"></ion-icon>
            </div>
        </div>
        <div class="text-2xl mobile:text-lg text-slate-700">Tingkatkan Brand Awareness Anda dengan Konten yang Menarik dan Perencanaan Strategis</div>
        <p class="text-slate-500 mobile:text-sm leading-8 mobile:leading-8">Kami membantu Anda menciptakan konten yang relevan, menarik, dan konsisten di berbagai platform digital. Dengan perencanaan strategis yang matang, kami memastikan setiap langkah kampanye media sosial Anda selaras dengan tujuan bisnis dan mampu meningkatkan keterlibatan, memperluas jangkauan, serta membangun hubungan yang bermakna dengan pelanggan Anda.</p>
        <div class="flex mobile:flex-col items-center mobile:items-start gap-4 mt-8">
            <div class="p-3 px-6 rounded-full text-sm bg-blue-500 text-white font-medium">Hubungi TakoTekno</div>
            <div class="p-3 px-6 rounded-full text-sm border-blue-500 text-blue-500 ">Selengkapnya</div>
        </div>
    </div>
    <div class="flex grow justify-end">
        <img src="{{ asset('images/content.svg') }}" alt="Content" class="w-full aspect-square">
    </div>
</div>

@include('components.clients')
@include('components.cta')

<div class="p-20 mobile:p-10">
    <h1 class="text-5xl mobile:text-3xl text-primary mb-6">Blog</h1>
    @include('components.dots', [
        'width' => 8,
        'height' => 1,
        'color' => "bg-primary"
    ])
    <div class="h-2"></div>
    @include('components.dots', [
        'width' => 6,
        'height' => 1,
        'color' => "bg-primary"
    ])

    {{-- <div class="flex flex-wrap gap-8 mt-10">
        @foreach ($posts as $post)
        <a href="{{ $post->link }}" target="_blank" class="flex flex-col basis-96 grow gap-4">
            <img src="{{ $post->featured_media_url}}" alt="{{ $post->title->rendered }}" class="rounded-lg aspect-video object-cover">
            <div>{{ $post->title->rendered }}</div>
        </a>
        @endforeach --}}
    </div>
</div>
@endsection