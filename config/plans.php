<?php

return [
    'basic' => [
        'label' => 'Basic',
        'price' => 0,
        'produk' => 10,
        'transaksi' => 100,
        'karyawan' => 0,
        'laporan' => false,
        'absensi' => false,
        'ai' => false,
        'struk' => false,
    ],
    'starter' => [
        'label' => 'Starter',
        'price' => 29000,
        'produk' => 50,
        'transaksi' => 'Unlimited',
        'karyawan' => 2,
        'laporan' => false,
        'absensi' => true,
        'ai' => true,
        'struk' => true,
    ],
    'pro' => [
        'label' => 'PRO',
        'price' => 69000,
        'produk' => 'Unlimited',
        'transaksi' => 'Unlimited',
        'karyawan' => 'Unlimited',
        'laporan' => true,
        'absensi' => true,
        'ai' => true,
        'struk' => true,
    ],
];
