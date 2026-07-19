<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title') - {{ env('APP_NAME') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {!! json_encode(config('tailwind')) !!}
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        div, aside, header { transition: 0.4s; }
        body {
            font-family: "Poppins", sans-serif;
            font-style: normal;
            font-weight: 400;
            color: #34495e;
        }
    </style>
    @yield('head')
</head>
<body class="bg-primary-body">

<div class="w-full h-20 flex items-center justify-between gap-4 px-4 md:px-20 sticky z-20 top-0 left-0 right-0 bg-white" id="header">
    @php
        $route = Route::currentRouteName();
        $routes = explode(".", $route);
    @endphp
    <a href="/" class="flex items-center gap-4">
        <img src="/images/tt.png" alt="Header icon" class="h-8">
        <div class="font-[600] text-lg">Takotoko</div>
    </a>
    <div class="hidden md:flex items-center gap-2 grow">
        <div class="flex items-center gap-2 p-3 px-4 group relative rounded-lg hover:bg-primary-transparent {{ $routes[0] == 'about' ? 'bg-primary-transparent' : '' }}">
            <div class="text-sm {{ $routes[0] == 'about' ? 'text-primary font-[600]' : 'text-slate-800 font-[500]' }}">Tentang</div>
            <ion-icon name="chevron-down-outline" class="{{ $routes[0] == 'about' ? 'text-primary' : '' }}"></ion-icon>

            <div class="absolute top-0 left-0 pt-14 hidden group-hover:flex flex-col hover:flex">
                <div class="bg-white rounded-lg p-4 min-w-[350px]">
                    <div class="text-slate-400 text-sm font-medium p-4">Tentang Kami</div>
                    @foreach (config('menus.about') as $item)
                        <a href="{{ route($item['route']) }}" class="flex items-center gap-4 p-4 hover:bg-primary-body rounded-lg">
                            <div class="min-w-12 h-12 rounded-xl flex items-center justify-center {{ $item['color'] }} text-white">
                                <ion-icon name="{{ $item['icon'] }}" class="text-2xl"></ion-icon>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="{{ $route == $item['route'] ? 'text-primary font-[600]' : 'text-slate-700 font-[500]' }} text-sm">
                                    {{ $item['title'] }}
                                </div>
                                <div class="text-slate-500 text-xs">{{ $item['desc'] }}</div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2 p-3 px-4 group relative rounded-lg hover:bg-primary-transparent {{ $routes[0] == 'solusi' ? 'bg-primary-transparent' : '' }}">
            <div class="text-sm {{ $routes[0] == 'solusi' ? 'text-primary font-[600]' : 'text-slate-800 font-[500]' }}">Punya Masalah Ini?</div>
            <ion-icon name="chevron-down-outline" class="{{ $routes[0] == 'solusi' ? 'text-primary' : '' }}"></ion-icon>

            <div class="absolute top-0 left-0 pt-14 hidden group-hover:flex flex-col hover:flex">
                <div class="bg-white rounded-lg p-4 min-w-[300px]">
                    <div class="text-slate-400 text-sm font-medium p-4">Solusi</div>
                    @foreach (config('menus.solusi') as $item)
                        <a href="{{ route($item['route']) }}" class="flex items-center gap-4 p-4 hover:bg-primary-body rounded-lg">
                            <div class="min-w-12 h-12 rounded-xl flex items-center justify-center {{ $item['color'] }} text-white">
                                <ion-icon name="{{ $item['icon'] }}" class="text-2xl"></ion-icon>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="{{ $route == $item['route'] ? 'text-primary font-[600]' : 'text-slate-700 font-[500]' }} text-sm">
                                    {{ $item['label'] }}
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2 p-3 px-4 group relative rounded-lg hover:bg-primary-transparent {{ $routes[0] == 'case' ? 'bg-primary-transparent' : '' }}">
            <div class="text-sm {{ $routes[0] == 'case' ? 'text-primary font-[600]' : 'text-slate-800 font-[500]' }}">Cocok untuk bisnismu?</div>
            <ion-icon name="chevron-down-outline" class="{{ $routes[0] == 'case' ? 'text-primary' : '' }}"></ion-icon>

            <div class="absolute top-0 left-0 pt-14 hidden group-hover:flex flex-col hover:flex">
                <div class="bg-white rounded-lg p-4 min-w-[300px]">
                    <div class="text-slate-400 text-sm font-medium p-4">Industri</div>
                    @foreach (config('menus.case') as $item)
                        <a href="{{ route($item['route']) }}" class="flex items-center gap-4 p-4 py-3 hover:bg-primary-body rounded-lg">
                            <div class="min-w-6 h-6 rounded-full flex items-center justify-center bg-green-500 text-white">
                                <ion-icon name="checkmark"></ion-icon>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="{{ $route == $item['route'] ? 'text-primary font-[600]' : 'text-slate-700 font-[500]' }} text-sm">
                                    {{ $item['label'] }}
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2 p-3 px-4 group relative rounded-lg hover:bg-primary-transparent {{ $routes[0] == 'resource' ? 'bg-primary-transparent' : '' }}">
            <div class="text-sm {{ $routes[0] == 'resource' ? 'text-primary font-[600]' : 'text-slate-800 font-[500]' }}">Sumber Daya</div>
            <ion-icon name="chevron-down-outline" class="{{ $routes[0] == 'resource' ? 'text-primary' : '' }}"></ion-icon>

            <div class="absolute top-0 left-0 pt-14 hidden group-hover:flex flex-col hover:flex">
                <div class="bg-white rounded-lg p-4 min-w-[350px]">
                    <div class="text-slate-400 text-sm font-medium p-4">Panduan & Pusat Bantuan</div>
                    @foreach (config('menus.resource') as $item)
                        <a href="{{ route($item['route']) }}" class="flex items-center gap-4 p-4 hover:bg-primary-body rounded-lg">
                            <div class="min-w-12 h-12 rounded-xl flex items-center justify-center {{ $item['color'] }} text-white">
                                <ion-icon name="{{ $item['icon'] }}" class="text-2xl"></ion-icon>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="{{ $route == $item['route'] ? 'text-primary font-[600]' : 'text-slate-700 font-[500]' }} text-sm">
                                    {{ $item['title'] }}
                                </div>
                                <div class="text-slate-500 text-xs">{{ $item['desc'] }}</div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>

        
    </div>

    <div class="flex items-center gap-4">
        <a href="#" class="bg-primary text-white text-xs font-medium rounded-full p-3 px-5">
            Coba Sekarang
        </a>
        <button id="mobile-menu-button" class="md:hidden text-2xl">
            <ion-icon name="menu-outline"></ion-icon>
        </button>
    </div>
</div>

<div id="mobile-menu" class="fixed inset-0 z-30 hidden">
    <div id="mobile-menu-overlay" class="absolute inset-0 bg-black/50"></div>
    <div id="mobile-menu-content" class="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl overflow-y-auto transition-transform translate-x-full">
        <div class="flex items-center justify-between mb-8">
            <a href="/" class="flex items-center gap-4">
                <img src="/images/tt.png" alt="Header icon" class="h-8">
                <div class="font-[600] text-lg">Takotoko</div>
            </a>
            <button id="mobile-menu-close" class="text-2xl">
                <ion-icon name="close-outline"></ion-icon>
            </button>
        </div>
        <div class="flex flex-col gap-4">
            @php
                $nav_menus = [
                    'about' => ['title' => 'Tentang', 'config' => 'menus.about', 'desc_key' => 'desc'],
                    'solusi' => ['title' => 'Punya Masalah Ini?', 'config' => 'menus.solusi', 'desc_key' => 'label'],
                    'case' => ['title' => 'Cocok untuk bisnismu?', 'config' => 'menus.case', 'desc_key' => 'label'],
                    'resource' => ['title' => 'Sumber Daya', 'config' => 'menus.resource', 'desc_key' => 'title'],
                ];
            @endphp

            @foreach ($nav_menus as $key => $menu)
                <div class="flex flex-col gap-2">
                    <button class="flex items-center justify-between p-3 rounded-lg hover:bg-primary-transparent text-sm font-medium {{ $routes[0] == $key ? 'text-primary' : 'text-slate-800' }} mobile-dropdown-btn">
                        {{ $menu['title'] }}
                        <ion-icon name="chevron-down-outline" style="{{ $routes[0] == $key ? 'transform: rotate(180deg); transition: 0.3s;' : 'transition: 0.3s;' }}"></ion-icon>
                    </button>
                    <div class="{{ $routes[0] == $key ? 'flex' : 'hidden' }} flex-col gap-2 mobile-dropdown-content">
                        @foreach (config($menu['config']) as $item)
                            <a href="{{ route($item['route']) }}" class="flex items-center gap-4 p-3 text-sm hover:bg-primary-body rounded-lg {{ $route == $item['route'] ? 'text-primary font-semibold' : 'text-slate-600' }}">
                                @if($key == 'case')
                                    <div class="min-w-6 h-6 rounded-full flex items-center justify-center bg-green-500 text-white">
                                        <ion-icon name="checkmark"></ion-icon>
                                    </div>
                                @elseif(isset($item['icon']))
                                    <div class="min-w-8 h-8 rounded-lg flex items-center justify-center {{ $item['color'] }} text-white">
                                        <ion-icon name="{{ $item['icon'] }}" class="text-lg"></ion-icon>
                                    </div>
                                @endif
                                @if (isset($item['title']))
                                    {{ $item['title'] }}
                                @endif
                            </a>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

@yield('content')

<footer class="p-20 mobile:p-8 bg-slate-800 text-white">
    <div class="flex mobile:flex-col gap-16 mobile:gap-8">
        <div class="flex flex-col gap-4 w-4/12 mobile:w-full">
            <h2 class="text-xl font-medium">{{ env('APP_NAME') }}</h2>
            <div class="text-sm text-slate-300 leading-7">
                Upscale bisnismu biar nggak gitu-gitu aja.
            </div>

            <div class="flex items-center gap-3 mt-2">
                <a href="mailto:halo@takotoko.com" class="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700 hover:bg-slate-500">
                    <ion-icon name="mail-outline"></ion-icon>
                </a>
                <a href="https://wa.me/6285159772902" class="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700 hover:bg-slate-500" target="_blank">
                    <ion-icon name="logo-whatsapp"></ion-icon>
                </a>
            </div>
        </div>
        <div class="flex flex-col gap-4 basis-32 grow">
            <h3 class="text-lg font-medium mb-2">Produk</h3>
            <a href="#" class="text-sm text-slate-300 hover:underline">
                Fitur
            </a>
            <a href="{{ route('pricing') }}" class="text-sm text-slate-300 hover:underline">
                Harga
            </a>
            <a href="#" class="text-sm text-slate-300 hover:underline">
                Panduan
            </a>
        </div>
        <div class="flex flex-col gap-4 basis-32 grow">
            <h3 class="text-lg font-medium mb-2">Perusahaan</h3>
            <a href="{{ route('about') }}" class="text-sm text-slate-300 hover:underline">
                Tentang
            </a>
            <a href="{{ route('blog') }}" class="text-sm text-slate-300 hover:underline">
                Blog
            </a>
            <a href="{{ route('about.contact') }}" class="text-sm text-slate-300 hover:underline">
                Hubungi Kami
            </a>
        </div>
        <div class="flex flex-col gap-4 basis-32 grow">
            <h3 class="text-lg font-medium mb-2">Unduh Aplikasi</h3>
            <a href="{{ env('GPLAY_URL') }}" class="p-4 border rounded-lg p-4 flex items-center gap-3" target="_blank">
                <ion-icon name="logo-google-playstore" class="text-3xl"></ion-icon>
                <div class="flex flex-col gap-1">
                    <div class="text-xs">Dapatkan di</div>
                    <div class="font-medium">Google Play</div>
                </div>
            </a>
        </div>
    </div>
    <div class="border-t border-slate-600 mt-12 pt-8 flex mobile:flex-wrap items-center gap-4">
        <div class="text-sm mobile:text-xs text-slate-500 mobile:w-full">
            ©{{ date('Y') }} PT Takotoko Niaga Daring. Hak Cipta Dilindungi.
        </div>
        <div class="flex grow mobile:hidden"></div>
        <a href="#" class="text-sm mobile:text-xs text-slate-300">
            Syarat & Ketentuan
        </a>
        <a href="{{ route('about.privacy') }}" class="text-sm mobile:text-xs text-slate-300">
            Kebijakan Privasi
        </a>
    </div>
</footer>

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<script>
    const select = dom => document.querySelector(dom);
    const selectAll = dom => document.querySelectorAll(dom);

    const toggleHidden = target => select(target).classList.toggle('hidden');

    document.addEventListener('DOMContentLoaded', () => {
        const menuBtn = document.getElementById('mobile-menu-button');
        const closeBtn = document.getElementById('mobile-menu-close');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');
        const content = document.getElementById('mobile-menu-content');
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

        const toggleMenu = (isOpen) => {
            if (isOpen) {
                menu.classList.remove('hidden');
                setTimeout(() => content.classList.remove('translate-x-full'), 10);
            } else {
                content.classList.add('translate-x-full');
                setTimeout(() => menu.classList.add('hidden'), 400);
            }
        };

        menuBtn.addEventListener('click', () => toggleMenu(true));
        closeBtn.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));

        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const contentDiv = btn.nextElementSibling;
                const icon = btn.querySelector('ion-icon');
                contentDiv.classList.toggle('hidden');
                contentDiv.classList.toggle('flex');
                icon.style.transform = contentDiv.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                icon.style.transition = '0.3s';
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                toggleMenu(false);
            }
        });
    });
</script>
@yield('javascript')

</body>
</html>