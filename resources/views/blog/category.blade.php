@extends('layouts.page')

@section('title', $category->name)

@section('content')
<div class="h-16"></div>
<div class="p-20 mobile:p-8 flex flex-col gap-8">
    <div class="flex items-center gap-4">
        <div class="flex flex-col gap-4 grow">
            <a href="{{ route('blog') }}" class="flex items-center gap-3 text-xs text-primary">
                <ion-icon name="arrow-back-outline" class="text-lg"></ion-icon>
                Lihat Semua
            </a>
            <h3 class="text-3xl text-slate-800 font-medium">{{ $category->name }}</h3>
        </div>
        <div class="text-slate-400">
            {{ $category->post_count }} konten
        </div>
    </div>

    <div class="grid grid-cols-3 mobile:grid-cols-2 gap-14 mobile:gap-4">
        @foreach ($posts as $post)
            <a href="{{ route('blog.read', $post->slug) }}" class="flex flex-col gap-2">
                <img src="{{ $post->cover }}" alt="{{ $post->title }}" class="w-full aspect-[16/9] rounded-lg object-cover">
                <h4 class="text-lg mobile:text-sm text-slate-800 font-medium mt-4">{{ $post->title }}</h4>
                <div class="flex mobile:flex-wrap items-center gap-4 mobile:gap-2">
                    @foreach ($post->categories as $cat)
                        <div class="text-xs mobile:text-[10px] text-primary font-medium">{{ $cat->name }}</div>
                    @endforeach
                </div>
            </a>
        @endforeach
    </div>

    {{ $posts->links() }}
</div>

@endsection

@section('ModalArea')
<div class="fixed top-16 mt-[-1px] z-20 left-0 right-0 h-16 bg-white/60 backdrop-blur-lg border-b flex items-center gap-4 px-20 overflow-x-auto">
    @foreach ($categories as $cat)
        <a href="{{ route('blog.category', $cat->slug) }}" class="p-3 px-5 text-sm whitespace-nowrap">
            {{ $cat->name }}
        </a>
    @endforeach
</div>
@endsection