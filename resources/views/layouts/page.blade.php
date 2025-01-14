<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6YK2C8LN4Y"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6YK2C8LN4Y');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title') {{ env('APP_NAME') }}</title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {!! json_encode(config('tailwind')) !!}
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        div { transition: 0.4s; }
        body {
            font-family: "Poppins", sans-serif;
            font-style: normal;
            font-weight: 400;
        }
    </style>
    @yield('head')
</head>
<body>

@php
    $routeName = Route::currentRouteName();
    $isWhiteHero = in_array($routeName, ['index', 'contact', 'blog']);

    $menus = [
        [
            'label' => "Home",
            'link' => "home",
        ]
    ];
@endphp
    
<div class="fixed top-0 left-0 right-0 h-20 flex items-center justify-center gap-4 px-12 mobile:px-10 z-20 {{ $isWhiteHero ? 'bg-white' : '' }}" id="header">
    <a href="{{ route('index') }}" class="flex grow w-4/12 items-center gap-4">
        <img src="{{ asset($isWhiteHero ? 'images/logo.png' : 'images/logo-white.png') }}" alt="Logo header" class="h-10" id="header-logo">
    </a>
    
    {{-- MOBILE MENU --}}
    <div class="desktop:hidden text-xl" onclick="toggleMenu()">
        <ion-icon name="grid-outline"></ion-icon>
    </div>
    <div class="fixed top-16 left-0 right-0 bottom-0 p-10 bg-white hidden opacity-0 duration-300 flex flex-col" id="header-menu-mobile">
        <div class="flex flex-col grow">
            <a href="{{ route('index') }}" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                <div class="flex grow">Home</div>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </a>
            <div class="relative group">
                <a href="#" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                    <div class="flex grow">Layanan</div>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                </a>

                <div class="hidden group-hover:flex flex-col gap-4 mt-2 mb-8">
                    <a href="{{ route('service.dev') }}" class="text-sm text-slate-500 flex items-center gap-4">
                        <ion-icon name="laptop-outline" class="text-2xl"></ion-icon>
                        <div class="flex grow">Web & Mobile App Development</div>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </a>
                    <a href="{{ route('service.ad') }}" class="text-sm text-slate-500 flex items-center gap-4">
                        <ion-icon name="bar-chart-outline" class="text-2xl"></ion-icon>
                        <div class="flex grow">Digital Ads Management</div>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </a>
                    {{-- <a href="{{ route('service.content') }}" class="text-sm text-slate-500 flex items-center gap-4">
                        <ion-icon name="create-outline" class="text-2xl"></ion-icon>
                        <div class="flex grow">Content Management</div>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </a> --}}
                </div>
            </div>
            <a href="{{ route('about') }}" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                <div class="flex grow">Tentang</div>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </a>
            {{-- <a href="{{ route('blog') }}" class="py-4 text-2xl text-slate-500 flex items-center gap-4">
                <div class="flex grow">Blog</div>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </a> --}}
        </div>

        <a href="{{ route('contact') }}" class="bg-primary rounded-full w-full mt-10 p-4 text-white">
            Hubungi Kami
        </a>
    </div>

    {{-- DESKTOP MENU --}}
    <div class="flex items-center justify-center gap-8 mobile:hidden {{ $isWhiteHero ? '' : 'opacity-0'}}" id="header-menu">
        <a href="{{ route('index') }}" class="h-12 flex items-center {{ $routeName == 'index' ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
            Home
        </a>
        <div class="relative group">
            <a href="#" class="h-12 flex items-center gap-2 {{ in_array('service', explode('.', $routeName)) ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
                Layanan
                <ion-icon name="chevron-down-outline"></ion-icon>
            </a>
            <div class="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-4 top-12 left-0 z-10">
                <a href="{{ route('service.dev') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
                    <ion-icon name="laptop-outline"></ion-icon>
                    Web & Mobile App Development
                </a>
                {{-- <a href="{{ route('service.content') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
                    <ion-icon name="create-outline"></ion-icon>
                    Content Management
                </a> --}}
                <a href="{{ route('service.ad') }}" class="py-2 px-4 hover:bg-gray-100 rounded-md whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
                    <ion-icon name="bar-chart-outline"></ion-icon>
                    Digital Ads Management
                </a>
            </div>
        </div>
        <a href="{{ route('about') }}" class="h-12 flex items-center {{ $routeName == 'about' ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
            Tentang
        </a>
        {{-- <a href="{{ route('blog') }}" class="h-12 flex items-center {{ $routeName == 'blog' ? 'border-b border-primary text-primary' : 'text-slate-600'}}">
            Blog
        </a> --}}
    </div>
    <div class="flex grow w-4/12 mobile:w-full justify-end mobile:hidden">
        <a href="{{ route('contact') }}" id="cta" class="bg-primary rounded-full p-4 mobile:p-2 px-8 mobile:px-4 text-white text-sm mobile:text-xs font-medium cursor-pointer">Hubungi Kami</a>
    </div>
</div>

<div class="absolute top-0 left-0 right-0 z-10">
    @yield('content')

    <footer class="p-20 mobile:p-10 border-t mt-8 flex mobile:flex-col gap-8 mobile:gap-4">
        <div class="flex flex-col gap-2 w-5/12 mobile:w-full">
            <a href="{{ route('index') }}">
                <img src="{{ asset('images/logo.png') }}" alt="Logo footer" class="h-16">
            </a>
            <div class="text-slate-400 mt-4">TAKOTEKNO</div>
            <div class="text-slate-400 text-sm">
                Perumahan Jaya Regency Blok BF-20, Sedati <br /> Sidoarjo, Jawa Timur
            </div>
        </div>
        <div class="flex flex-col grow gap-2 mobile:w-full">
            <div class="text-slate-700 text-xl font-bold mb-4">Laman</div>
            <li class="list-none"><a href="{{ route('about') }}" class="text-slate-500">Tentang</a></li>
            <li class="list-none"><a href="{{ route('blog') }}" class="text-slate-500">Blog</a></li>
            <li class="list-none"><a href="{{ route('contact') }}" class="text-slate-500">Hubungi Kami</a></li>
        </div>
        <div class="flex flex-col grow gap-2 mobile:w-full">
            <div class="text-slate-700 text-xl font-bold mb-4">Layanan</div>
            <li class="list-none"><a href="{{ route('service.dev') }}" class="text-slate-500">Web & Mobile App Development</a></li>
            {{-- <li class="list-none"><a href="{{ route('service.content') }}" class="text-slate-500">Content Management</a></li> --}}
            <li class="list-none"><a href="{{ route('service.ad') }}" class="text-slate-500">Digital Ads Management</a></li>
        </div>
        <div class="flex flex-col grow gap-2 mobile:w-full">
            <div class="text-slate-700 text-xl opacity-0 font-bold">Kontak</div>
            <a href="mailto:halo@takotekno.com" class="flex items-center gap-4">
                <div class="text-primary text-4xl">
                    <ion-icon name="mail-outline"></ion-icon>
                </div>
                <div class="flex flex-col grow">
                    <div class="text-slate-700 font-bold">Email</div>
                    <div class="text-slate-500 text-sm">halo@takotekno.com</div>
                </div>
            </diav>
            <a href="https://wa.me/6285159772902" target="_blank" class="flex items-center gap-4 mt-4">
                <div class="text-primary text-4xl">
                    <ion-icon name="logo-whatsapp"></ion-icon>
                </div>
                <div class="flex flex-col grow">
                    <div class="text-slate-700 font-bold">Whatsapp</div>
                    <div class="text-slate-500 text-sm">+62 851 5977 2902</div>
                </div>
            </a>
        </div>
    </footer>
</div>

@yield('ModalArea')

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<script>
    const select = dom => document.querySelector(dom);
    const header = document.querySelector("#header");
    const headerLogo = document.querySelector("#header-logo");
    const headerMenu = document.querySelector("#header-menu");
    const headerMenuMobile = document.querySelector("#header-menu-mobile");
    const heightToScreen = document.querySelectorAll(".heightToScreen");
    const logo = "{{ asset('images/logo.png') }}";
    const logoWhite = "{{ asset('images/logo-white.png') }}";
    const isWhiteHero = JSON.parse("{{ json_encode($isWhiteHero) }}");

    function isDOM(obj) {
        return obj instanceof Element || obj instanceof HTMLDocument;
    }

    window.addEventListener("scroll", e => {
        let pos = window.scrollY;

        if (pos > 60) {
            header.classList.add('bg-white', 'shadow-lg');
            if (!isWhiteHero) {
                headerLogo.setAttribute('src', logo);
                headerMenu.style.opacity = "1";
            }
        } else {
            header.classList.remove('bg-white', 'shadow-lg');
            if (!isWhiteHero) {
                headerLogo.setAttribute('src', logoWhite);
                headerMenu.style.opacity = "0.01";
            }
        }
    });

    heightToScreen.forEach(item => {
        item.style.height = `${window.innerHeight}px`;
    })

    const toggleFaq = item => {
        document.querySelectorAll('.faq-answer').forEach(item => item.classList.add('hidden'));
        let childs = item.childNodes;
        childs.forEach(item => {
            if (isDOM(item) && item.classList.contains('faq-answer')) {
                item.classList.toggle('hidden');
            }
        })
    }
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