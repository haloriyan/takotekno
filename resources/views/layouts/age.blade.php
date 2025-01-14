<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title') AGE Creative</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {!! json_encode(config('tailwind')) !!}
    </script>
    <style>
        div { transition: 0.4s; }
        body {
            font-family: "Poppins", serif;
        }
    </style>
    @yield('head')
</head>
<body>

@php
    $routeName = Route::currentRouteName();
@endphp

<header class="fixed top-0 left-0 right-0 h-20 z-30 bg-white flex items-center gap-10 mobile:gap-4 border-b px-20 mobile:px-10">
    <a href="{{ route('age.index') }}">
        <img src="{{ asset('images/age/logo.png') }}" alt="Header Logo" class="h-12">
    </a>
    <div class="fixed top-16 left-0 right-0 bottom-0 p-10 bg-white hidden opacity-0 duration-300 flex flex-col" id="header-menu-mobile">
        <div class="flex flex-col grow">
            <a href="{{ route('age.index') }}" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                <div class="flex grow">Home</div>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </a>
            <a href="{{ route('age.about') }}" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                <div class="flex grow">About Us</div>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </a>
            <div class="relative group">
                <a href="#" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                    <div class="flex grow">Layanan</div>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                </a>

                <div class="hidden group-hover:flex flex-col gap-4 mt-2 mb-8">
                    <a href="{{ route('age.service.eventManagement') }}" class="text-sm text-slate-500 flex items-center gap-4">
                        <ion-icon name="calendar-outline" class="text-2xl"></ion-icon>
                        <div class="flex grow">Event Management</div>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </a>
                    <a href="{{ route('age.service.production') }}" class="text-sm text-slate-500 flex items-center gap-4">
                        <ion-icon name="cog-outline" class="text-2xl"></ion-icon>
                        <div class="flex grow">Production</div>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </a>
                    <a href="{{ route('age.service.advertising') }}" class="text-sm text-slate-500 flex items-center gap-4">
                        <ion-icon name="volume-high-outline" class="text-2xl"></ion-icon>
                        <div class="flex grow">Advertising</div>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </a>
                </div>
            </div>
            <a href="{{ route('age.client') }}" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                <div class="flex grow">Our Clients</div>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </a>
        </div>
    </div>

    {{-- DESKTOP MENU --}}
    <div class="flex items-center justify-center gap-8 mobile:hidden" id="header-menu">
        <a href="{{ route('age.index') }}" class="h-12 flex items-center {{ $routeName == 'age.index' ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
            Home
        </a>
        <a href="{{ route('age.about') }}" class="h-12 flex items-center {{ $routeName == 'age.about' ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
            About Us
        </a>
        <div class="relative group">
            <a href="#" class="h-12 flex items-center gap-2 {{ in_array('service', explode('.', $routeName)) ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
                Services
                <ion-icon name="chevron-down-outline"></ion-icon>
            </a>
            <div class="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-4 top-12 left-0 z-10">
                <a href="{{ route('age.service.eventManagement') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
                    <ion-icon name="calendar-outline"></ion-icon>
                    Event Management
                </a>
                <a href="{{ route('age.service.production') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
                    <ion-icon name="cog-outline"></ion-icon>
                    Production
                </a>
                <a href="{{ route('age.service.advertising') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
                    <ion-icon name="volume-high-outline"></ion-icon>
                    Advertising
                </a>
                <a href="{{ route('age.service.eventEquipment') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
                    <ion-icon name="hammer-outline"></ion-icon>
                    Event Equipment
                </a>
                <a href="{{ route('age.service.procurementGoods') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
                    <ion-icon name="clipboard-outline"></ion-icon>
                    Procurement Goods
                </a>
            </div>
        </div>
        <a href="{{ route('age.client') }}" class="h-12 flex items-center {{ $routeName == 'age.client' ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
            Our Clients
        </a>
    </div>

    <div class="flex grow"></div>

    <a href="{{ route('age.contact') }}" class="p-3 px-6 rounded-full bg-orange-500 text-white font-medium text-sm">
        Contact Us
    </a>

    {{-- MOBILE MENU --}}
    <div class="desktop:hidden text-xl" onclick="toggleMenu()">
        <ion-icon name="grid-outline"></ion-icon>
    </div>
</header>

<div class="absolute top-20 left-0 right-0 z-10 text-slate-700">
    @yield('content')
</div>

@yield('outer')

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<script>
    const select = dom => document.querySelector(dom);
    const selectAll = dom => document.querySelectorAll(dom);

    const headerMenuMobile = select("#header-menu-mobile");
    const toggleMenu = () => {
        if (headerMenuMobile.classList.contains('hidden')) {
            headerMenuMobile.classList.toggle('hidden');
            setTimeout(() => {
                headerMenuMobile.classList.toggle('opacity-0');
            }, 100);
        } else {
            headerMenuMobile.classList.toggle('opacity-0');
            setTimeout(() => {
                headerMenuMobile.classList.toggle('hidden');
            }, 400);
        }
    }
    const toggleHidden = target => {
        select(target).classList.toggle('hidden');
    }
    const scrollTo = (target, block = 'start') => {
        select(target).scrollIntoView({
            behavior: 'smooth',
            block: block,
        })
    }
</script>

@yield('javascript')

</body>
</html>