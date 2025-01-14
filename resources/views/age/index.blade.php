@extends('layouts.age')

@section('head')
<link rel="stylesheet" href="{{ asset('css/slideshow.css') }}">
@endsection

@section('content')
<div class="absolute mobile:hidden rounded-full w-[333px] h-[333px] bg-[#F9A8D460] top-8 left-[500px]"></div>
<div class="absolute mobile:hidden rounded-full w-[333px] h-[333px] bg-[#FDE04760] top-[420px] left-[600px]"></div>
<div class="absolute mobile:hidden rounded-full w-[555px] h-[555px] bg-[#1D89AD60] top-[40px] left-[800px]"></div>
<div class="absolute mobile:hidden top-[800px] right-[535px]">
    <img src="{{ asset('images/age/circle.png') }}" alt="circle" class="w-full">
</div>
<div class="absolute mobile:hidden top-[700px] right-[135px]">
    <img src="{{ asset('images/age/triangle.png') }}" alt="triangle" class="w-full">
</div>

<div class="flex mobile:flex-col relative">

    <div class="flex flex-col gap-4 basis-5/12 mobile:w-full p-20 pe-0 mobile:p-10">
        <h1 class="text-5xl mobile:text-2xl font-bold text-slate-700 leading-[72px] mobile:leading-[42px] desktop:mt-24">
            WE MAKE YOUR IMAGINATION TO BE AN <i class="underline">INSANELY GREAT</i> EXPERIENCE
        </h1>
    </div>
    <div class="flex grow p-20 mobile:p-10 mobile:pt-0 flex gap-6 mobile:gap-4 w-6/12 mobile:w-full">
        <div class="flex flex-col grow gap-6 mobile:gap-4">
            <img src="{{ asset('images/age/ktf.jpg') }}" alt="Hero1" class="w-[200px] rounded-xl object-cover h-[177px]">
            <img src="{{ asset('images/age/vwe-3.jpg') }}" alt="Hero2" class="w-[200px] rounded-xl object-cover h-[410px] mobile:h-[120px]">
        </div>
        <div class="flex flex-col grow gap-6 mobile:gap-4">
            <img src="{{ asset('images/age/ktf-2.jpg') }}" alt="Hero1" class="w-[200px] rounded-xl object-cover h-[410px] mobile:h-[120px]">
            <img src="{{ asset('images/age/vwe-2.jpg') }}" alt="Hero2" class="w-[200px] rounded-xl object-cover h-[177px]">
        </div>
        <div class="flex flex-col grow gap-6 mobile:gap-4">
            <img src="{{ asset('images/age/vwe-3.jpg') }}" alt="Hero1" class="w-[200px] rounded-xl object-cover h-[177px]">
            <img src="{{ asset('images/age/vwe.jpg') }}" alt="Hero2" class="w-[200px] rounded-xl object-cover h-[410px] mobile:h-[120px]">
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10 relative">
    <div class="flex flex-col gap-4 grow">
        <h3 class="text-4xl mobile:text-xl font-bold leading-[54px]">WITH GREAT EVENT,<br />COMES GREAT ORGANIZER</h3>
        <div class="w-[200px] h-2 bg-orange-500 rounded-full"></div>
        <div class="text-sm mobile:text-xs text-slate-600 leading-[36px] mobile:leading-[28px] mt-8 mobile:mt-2">
            AGE Creative berkomitmen menghadirkan layanan event yang kompeten dan kredibel, membantu klien dalam mencapai target dan tujuan untuk mengadakan aktivitas event, dan juga menghadirkan nilai lebih untuk klien kami dan berkontribusi pada pertumbuhan finansial.
        </div>
    </div>
    <div class="flex w-5/12">
        <iframe class="rounded-xl" width="560" height="315" src="https://www.youtube.com/embed/GbNfLvW1ztE?si=LjUzLiGh5m__b5yH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>

    <div class="absolute top-48 left-0 right-0">
        <img src="{{ asset('images/age/union.png') }}" alt="Union" class="w-full">
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10 relative">
    <div class="flex flex-col gap-4 grow">
        <h3 class="text-4xl mobile:text-xl text-center font-bold leading-[54px]">SELALU SIAP DALAM SEGALA KEBUTUHAN.</h3>

        <div class="flex mobile:flex-col p-2 rounded-full bg-white/50">
            @foreach ($services as $s => $service)
                <div class="flex items-center justify-center mobile:justify-start mobile:px-4 gap-4 grow h-12 cursor-pointer rounded-full ServiceItem {{ $s == 0 ? 'bg-orange-500 text-white' : '' }}" onclick="chooseService(this, '{{ $s }}')">
                    <ion-icon name="{{ $service['icon'] }}" class="text-lg"></ion-icon>
                    <div class="text-sm">{{ $service['name'] }}</div>
                </div>
            @endforeach
            
        </div>
        @foreach ($services as $s => $service)
            <div class="ServiceGallery w-full bg-gray-200 rounded-xl aspect-video mobile:aspect-square relative bg-fit {{ $s == 0 ? '' : 'hidden' }}" style="background-image: url({{ asset('images/age/' . $service['image']) }})">
                <div class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 text-white mobile:text-sm flex flex-col gap-10 mobile:gap-4 items-center justify-center rounded-xl">
                    @foreach ($service['sub'] as $sub)
                        <h4 class="text-2xl font-bold">{{ $sub }}</h4>
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>
</div>

@php
    use Carbon\Carbon;
    $works = [
        [
            'title' => "Virtual Wedding Expo 2020",
            'date' => "2020-12-10",
            'images' => [
                'vwe.jpg', 'vwe-2.jpg'
            ]
        ],
        [
            'title' => "Korea Travel Fest 2024",
            'date' => "2024-08-10",
            'images' => [
                'ktf.jpg', 'ktf-2.jpg'
            ]
        ],
    ];
@endphp

<div class="p-20 mobile:p-10 flex flex-col relative bg-contain bg-no-repeat bg-bottom" style="background-image: url(/images/age/wave.png)">
    <div class="flex flex-col gap-4 w-full grow">
        <h3 class="text-4xl mobile:text-xl font-bold leading-[54px]">MENGHADIRKAN PENGALAMAN TERBAIK.</h3>
        <div class="w-[200px] h-2 bg-orange-500 rounded-full"></div>
        <div class="text-sm mobile:text-xs text-slate-600 leading-[36px] mobile:leading-[28px] mt-8 mobile:mt-2">
            Kami selalu <i>all-out</i> dalam menjalankan setiap pekerjaan. Dengan skill komunikasi yang bagus dan kalkulasi yang akurat, kami mampu menghadirkan pengalaman terbaik kepada audiens dan nilai lebih untuk mitra kami.
        </div>

        <div class="grid grid-cols-3 mobile:grid-cols-1 gap-4">
            @foreach ($works as $work)
                <main class="main-content">
                    <section class="slideshow rounded-xl">
                        <div class="slideshow-inner rounded-xl">
                            <div class="slides">
                                @foreach ($work['images'] as $i => $image)
                                    <div class="slide {{ $i == 0 ? 'is-active' : '' }} ">
                                        <div class="absolute top-0 left-0 right-0 bottom-0 text-white z-50 flex flex-col gap-4 items-center justify-center">
                                            <h4 class="text-xl font-medium">{{ $work['title'] }}</h4>
                                            <div class="text-sm">{{ Carbon::parse($work['date'])->isoFormat('DD MMM Y') }}</div>
                                        </div>
                                        <div class="image-container"> 
                                            <img src="{{ asset('images/age/' . $image) }}" alt="" class="image" />
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                            <div class="pagination">
                                @foreach ($work['images'] as $i => $image)
                                    <div class="item {{ $i == 0 ? 'is-active' : '' }}"> 
                                        <span class="icon">{{ $i + 1 }}</span>
                                    </div>
                                @endforeach
                            </div>
                            <div class="arrows">
                                <div class="arrow prev">
                                    <span class="svg svg-arrow-left">
                                        <svg version="1.1" id="svg4-Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="26px" viewBox="0 0 14 26" enable-background="new 0 0 14 26" xml:space="preserve"> <path d="M13,26c-0.256,0-0.512-0.098-0.707-0.293l-12-12c-0.391-0.391-0.391-1.023,0-1.414l12-12c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414L2.414,13l11.293,11.293c0.391,0.391,0.391,1.023,0,1.414C13.512,25.902,13.256,26,13,26z"/> </svg>
                                        <span class="alt sr-only"></span>
                                    </span>
                                </div>
                                <div class="arrow next">
                                    <span class="svg svg-arrow-right">
                                        <svg version="1.1" id="svg5-Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="26px" viewBox="0 0 14 26" enable-background="new 0 0 14 26" xml:space="preserve"> <path d="M1,0c0.256,0,0.512,0.098,0.707,0.293l12,12c0.391,0.391,0.391,1.023,0,1.414l-12,12c-0.391,0.391-1.023,0.391-1.414,0s-0.391-1.023,0-1.414L11.586,13L0.293,1.707c-0.391-0.391-0.391-1.023,0-1.414C0.488,0.098,0.744,0,1,0z"/> </svg>
                                        <span class="alt sr-only"></span>
                                    </span>
                                </div>
                            </div>
                    </div> 
                    </section>
                </main>
            @endforeach
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 bg-white rounded-xl relative top-[-170px]">
    <h3 class="text-4xl mobile:text-xl font-bold leading-[54px] mt-10">KLIEN KAMI</h3>
    <div class="w-[200px] h-2 bg-orange-500 rounded-full"></div>
    <div class="grid grid-cols-5 mobile:grid-cols-2 gap-10 mt-4">
        @for($i = 0; $i < 8; $i++)
            <div class="bg-white rounded-xl shadow-lg p-8">
                <img src="{{ asset('images/age/logo.png') }}" alt="AGE Logo">
            </div>
        @endfor
    </div>
</div>

@include('age.components.footer')
@endsection

@section('javascript')
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenMax.min.js"></script>
<script>
    const serviceGalleries = selectAll(".ServiceGallery");
    const chooseService = (dom, index) => {
        selectAll(".ServiceItem").forEach(item => {
            item.classList.remove('bg-orange-500', 'text-white');
        });
        serviceGalleries.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('hidden');
        })
        serviceGalleries[index].classList.remove('hidden');
        dom.classList.add('bg-orange-500', 'text-white');
    }
</script>
<script src="{{ asset('js/slideshow.js') }}"></script>
@endsection