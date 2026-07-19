<?php

return [
    'about' => [
        [
            'route' => "about", 
            'title' => "Tentang Kami", 
            'desc' => "Pelajari lebih jauh tentang apa yang Kami lakukan.",
            'icon' => 'information-circle-outline', 
            'color' => "bg-purple-500"
        ],
        [
            'route' => "about.privacy", 
            'title' => "Kebijakan Privasi & Keamanan", 
            'desc' => "Kebijakan yang kami terapkan guna melindungi keamanan data.",
            'icon' => 'lock-closed-outline', 
            'color' => "bg-green-500"
        ],
        [
            'route' => "about.faq", 
            'title' => "FAQ", 
            'desc' => "Pertanyaan umum yang mungkin ingin kamu tanyakan.",
            'icon' => 'help-circle-outline', 
            'color' => "bg-orange-500"
        ],
        [
            'route' => "about.contact", 
            'title' => "Hubungi Kami", 
            'desc' => "Terhubung langsung dengan tim untuk bantuan atau pertanyaan.",
            'icon' => 'call-outline', 
            'color' => "bg-primary"
        ],
    ],
    'resource' => [
        [
            'route' => "about", 
            'title' => "Pusat Panduan", 
            'desc' => "Pelajari cara menggunakan aplikasi dari awal.",
            'icon' => 'information-circle-outline', 
            'color' => "bg-green-500"
        ],
        [
            'route' => "blog", 
            'title' => "Blog", 
            'desc' => "Insight baru untukmu.",
            'icon' => 'create-outline', 
            'color' => "bg-primary"
        ],
    ],
    'solusi' => [
        ['route' => "solusi.omset", 'label' => "Gatau hari ini jualan berapa dapet berapa", 'icon' => 'cash-outline', 'color' => "bg-primary"],
        ['route' => "solusi.inventory", 'label' => "Stok gak cocok sama penjualan", 'icon' => 'cube-outline', 'color' => "bg-orange-500"],
        ['route' => "solusi.absensi", 'label' => "Karyawan sering datang terlambat", 'icon' => 'people-outline', 'color' => "bg-green-500"],
    ],
    'case' => [
        ['route' => 'case.warkop', 'label' => "Warkop"],
        ['route' => 'case.warmad', 'label' => "Warung Madura"],
        ['route' => 'case.resto', 'label' => "Restoran"],
    ]
];