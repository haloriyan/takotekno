@extends('layouts.age')

@section('title', "Our Clients -")
    
@section('outer')
<div class="absolute top-0 left-0 right-0 h-[350px] bg-primary"></div>
@endsection

@section('content')
@php
    $clients = [
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
        [
            'name' => "Company Title",
            'logo' => "images/age/logo.png"
        ],
    ];
@endphp

<div class="p-20 mobile:p-10">
    <h2 class="text-white text-5xl mobile:text-4xl font-medium">Our Clients</h2>
    <div class="grid grid-cols-4 mobile:grid-cols-1 gap-10 mobile:gap-6 mt-10">
        @foreach ($clients as $client)
            <div class="bg-white p-10 mobile:p-6 rounded-xl flex flex-col gap-4 shadow-lg">
                <img src="{{ asset($client['logo']) }}" alt="{{ $client['name'] }}">
                <h3 class="mobile:hidden">{{ $client['name'] }}</h3>
            </div>
        @endforeach
    </div>
</div>

@include('age.components.footer')
@endsection