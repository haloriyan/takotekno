@extends('layouts.page')

@section('title', "Blog -")
    
@section('content')
<div class="p-20 pt-48 pb-16">
    <div class="w-36 mobile:w-20 h-1 mb-8 bg-primary"></div>
    <h1 class="text-5xl mobile:text-3xl text-primary">Blog</h1>
</div>

<div class="p-20 mobile:p-10 flex flex-wrap gap-8">
    @foreach ($posts as $post)
        <a href="{{ $post->link }}" target="_blank" class="flex flex-col basis-96 grow gap-4">
            <img src="{{ $post->featured_media_url}}" alt="{{ $post->title->rendered }}" class="rounded-lg aspect-video object-cover">
            <div>{{ $post->title->rendered }}</div>
        </a>
    @endforeach
</div>
@endsection