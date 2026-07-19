@extends('layouts.page')

@section('title', "Blog")
    
@section('content')
<div class="h-16"></div>
<div class="p-20 mobile:p-8 grid grid-cols-2 mobile:grid-cols-1 gap-14">
    <div class="flex flex-col gap-4">
        <a href="{{ route('blog.read', $featured[0]->slug) }}" class="w-full relative group flex flex-col gap-2">
            <img src="{{ $featured[0]->cover }}" alt="{{ $featured[0]->title }}" class="w-full aspect-[16/9] rounded-xl object-cover">
            <h3 class="text-slate-800 text-2xl leading-[42px] font-bold mt-4">{{ $featured[0]->title }}</h3>
            <p class="text-sm text-slate-600">{{ substr($featured[0]->body, 0, 100) }}</p>
            {{-- <div class="absolute top-0 left-0 right-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-b from-[#00000040] to-[#00000070] rounded-xl">
                <h3 class="text-white text-2xl leading-[42px] font-bold">{{ $featured[0]->title }}</h3>
            </div> --}}
        </a>
    </div>
    <div class="flex flex-col gap-4">
        @foreach ($featured as $p => $post)
            @if ($p > 0)
                <a href="{{ route('blog.read', $post->slug) }}" class="flex items-center gap-6">
                    <img src="{{ $post->cover }}" alt="{{ $post->title }}" class="h-24 w-24 aspect-square rounded-lg object-cover">
                    <div class="flex flex-col gap-1">
                        <h3 class="text-lg text-slate-800 font-medium">{{ $post->title }}</h3>
                        <div class="text-sm text-primary flex items-center gap-4">
                            @foreach ($post->categories as $cat)
                                <div class="text-xs font-medium">
                                    {{ $cat->name }}
                                </div>
                            @endforeach
                        </div>
                    </div>
                </a>
            @endif
        @endforeach
    </div>
</div>

@foreach ($sections as $sect)
    <section class="">
        <div class="flex items-center gap-4 py-8 px-20 mobile:px-8">
            <h3 class="text-4xl mobile:text-xl text-slate-800 font-medium">{{ $sect->name }}</h3>
            <div class="flex grow"></div>
            <a href="{{ route('blog.category', $sect->slug) }}" class="text-slate-800 font-medium">LAINNYA</a>
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

@section('ModalArea')
<div class="fixed top-16 mt-[-1px] z-20 left-0 right-0 h-16 bg-white/60 backdrop-blur-lg border-b flex items-center gap-4 px-20 mobile:px-8 overflow-x-auto">
    @foreach ($categories as $cat)
        <a href="{{ route('blog.category', $cat->slug) }}" class="p-3 px-5 mobile:px-4 text-sm whitespace-nowrap">
            {{ $cat->name }}
        </a>
    @endforeach
</div>
@endsection