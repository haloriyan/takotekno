@extends('layouts.page')

@section('title', $post->title)
    
@section('content')
<div class="p-8 px-20 mobile:p-0">
    <div class="group relative">
        <img src="{{ $post->cover }}" alt="{{ $post->cover }}" class="w-full aspect-[5/2] mobile:aspect-square rounded-xl object-cover">
        <div class="absolute top-0 left-0 right-0 bottom-0 p-10 mobile:p-6 flex flex-col justify-end bg-gradient-to-b from-[#00000030] to-[#00000090] rounded-xl backdrop-blur-sm">
            <h1 class="text-4xl mobile:text-xl text-white font-medium">{{ $post->title }}</h1>
            <p class="text-lg mobile:text-sm text-white mt-4">{{ $post->body }}</p>
            <a href="{{ $post->photographer_url}}" class="text-xs text-white mt-4 flex items-center gap-2" target="_blank">
                <ion-icon name="camera-outline" class="text-lg"></ion-icon>
                {{ $post->photographer }} - Pexels
            </a>
        </div>
    </div>
</div>
<div class="px-20 p-8 mobile:p-8 flex mobile:flex-col justify-center gap-20">
    <div class="w-8/12 mobile:w-full flex flex-col gap-8 ">

        @foreach ($post->slides as $slide)
            <h3 class="text-2xl mobile:text-xl text-slate-800 font-medium">{{ $slide->title }}</h3>
            <p class="text-lg mobile:text-sm text-slate-600 leading-8 mobile:leading-[32px]">{{ $slide->body }}</p>
        @endforeach
    </div>
    <div class="flex flex-col gap-4 basis-24 grow">
        <div class="p-4 bg-primary rounded-lg text-sm text-white font-medium px-6">
            Mungkin Kamu Tertarik
        </div>
        @foreach ($related as $item)
            <a href="{{ route('blog.read', $item->slug) }}" class="flex items-center gap-3">
                <img src="{{ $item->cover }}" alt="{{ $item->title }}" class="h-20 w-20 aspect-square rounded-lg object-cover">
                <div class="flex flex-col gap-1">
                    <h3 class="text-sm text-slate-800 font-medium">{{ $item->title }}</h3>
                    <div class="text-xs text-primary flex items-center gap-4">
                        @foreach ($item->categories as $cat)
                            <div class="text-xs font-medium">
                                {{ $cat->name }}
                            </div>
                        @endforeach
                    </div>
                </div>
            </a>
        @endforeach
    </div>
</div>

@foreach ($sections as $sect)
    <section class="">
        <div class="flex items-center gap-4 py-8 px-20 mobile:px-8">
            <h3 class="text-4xl mobile:text-xl text-slate-800 font-medium">{{ $sect->name }}</h3>
            <div class="flex grow"></div>
            <a href="#" class="text-slate-800 font-medium">LAINNYA</a>
        </div>
        <div class="flex items-start gap-8 px-20 mobile:px-8 overflow-x-auto w-full">
            @foreach ($sect->posts as $post)
                <a href="{{ route('blog.read', $post->slug) }}" class="flex flex-col shrink basis-86 min-w-[360px] mobile:min-w-[240px] gap-2">
                    <img src="{{ $post->cover }}" alt="{{ $post->title }}" class="w-full aspect-[16/9] rounded-lg object-cover">
                    <h4 class="text-lg mobile:text-sm text-slate-800 font-medium mt-4">{{ $post->title }}</h4>
                    <div class="flex items-center gap-4">
                        @foreach ($post->categories as $cat)
                            <div class="text-xs text-primary font-medium">{{ $cat->name }}</div>
                        @endforeach
                    </div>
                </a>
            @endforeach
        </div>
    </section>
@endforeach

<div class="h-20"></div>
@endsection