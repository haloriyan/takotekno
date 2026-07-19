@extends('layouts.page')

@section('content')
<section class="w-full aspect-[16/9] flex mobile:flex-col items-center gap-10 p-20 mobile:p-8">
    <div class="flex flex-col mobile:items-center mobile:text-center gap-4 w-6/12 mobile:w-full mobile:pt-8">
        <div class="flex">
            <div class="text-xs p-2 px-3 rounded-lg text-primary bg-primary bg-opacity-25">
                POS yang benar-benar membantumu berjualan.
            </div>
        </div>

        <h2 class="text-5xl mobile:text-2xl text-slate-800 font-bold leading-[64px]">
            Jualan Lebih Mudah,
            <span class="text-primary">Omset Makin Bertambah</span>
        </h2>
        <div class="text-slate-500 mobile:text-sm leading-[32px]">
            Stop nyatet bahan manual. Cegah pegawaimu "jualan sendiri".<br />Berbisnis layaknya entrepreneur sejati yang mengacu pada data.
        </div>

        <div class="flex items-center gap-6 mobile:gap-4 mt-8 mobile:mt-2">
            <a href="{{ env('GPLAY_URL') }}" class="p-4 mobile:p-3 px-8 mobile:px-5 rounded-lg mobile:text-xs border border-primary bg-primary text-white font-medium" target="_blank">
                Coba Sekarang
            </a>
            <a href="#" class="p-4 mobile:p-3 px-8 mobile:px-5 rounded-lg mobile:text-xs border">
                Selengkapnya
            </a>
        </div>
    </div>
    <div class="flex justify-center grow group relative">
        <img src="/images/hero_home.jpeg" alt="Hero" class="w-7/12 mobile:w-full aspect-[9/16] rounded-2xl bg-slate-200 object-cover">

        <div class="absolute top-20 left-0 bg-white p-4 mobile:p-2 rounded-lg flex items-center gap-4 shadow shadow-md">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <ion-icon name="bar-chart-outline" class="text-green-500 text-lg"></ion-icon>
            </div>
            <div class="flex flex-col">
                <h4 class="text-slate-800 font-medium mobile:text-xs">Omset Naik</h4>
                <div class="text-xs text-green-500">+45% bulan ini</div>
            </div>
        </div>

        <div class="absolute bottom-24 mobile:bottom-36 right-0 bg-white p-4 mobile:p-2 rounded-lg flex items-center gap-4 shadow shadow-md">
            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <ion-icon name="cube-outline" class="text-orange-500 text-lg"></ion-icon>
            </div>
            <div class="flex flex-col">
                <h4 class="text-slate-800 font-medium mobile:text-xs">Stok Aman</h4>
                <div class="text-xs text-slate-500">Otomatis Tercatat</div>
            </div>
        </div>
        
        <div class="absolute bottom-14 mobile:bottom-10 left-0 bg-white p-4 mobile:p-2 rounded-lg flex items-center gap-4 shadow shadow-md">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ion-icon name="time-outline" class="text-blue-500 text-lg"></ion-icon>
            </div>
            <div class="flex flex-col">
                <h4 class="text-slate-800 font-medium mobile:text-xs">Tau kapan toko rame</h4>
                <div class="text-xs text-slate-500">Rame di Jam 5 Sore</div>
            </div>
        </div>
    </div>
</section>

<section class="bg-white p-20 mobile:p-8 flex flex-col items-center gap-4">
    <h3 class="text-center mobile:text-left text-3xl mobile:text-xl text-slate-800 font-bold mobile:w-full">
        Bisnis Cara Lama itu Capek!
    </h3>
    <div class="mobile:hidden"></div>
    <div class="text-center mobile:text-left text-lg mobile:text-sm text-slate-500 leading-8 w-7/12 mobile:w-full">
        Banyak waktu terbuang. Keuangan sering bocor. Ujung-ujungnya banyak komplain dan pelanggan pindah haluan.
    </div>

    <div class="grid grid-cols-2 mobile:grid-cols-1 gap-10 w-10/12 mobile:w-full mt-8">
        <div class="p-10 mobile:p-8 rounded-lg border flex flex-col gap-4 bg-white">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex items-center justify-center border border-red-500 rounded-full">
                    <ion-icon name="flag-outline" class="text-lg text-red-500"></ion-icon>
                </div>
                <h4 class="text-lg text-slate-800 font-medium">Cara Lama</h4>
            </div>

            <div class="flex items-start gap-2 mt-4">
                <ion-icon name="close-circle-outline" class="text-red-500 text-2xl"></ion-icon>
                <div class="text-sm text-slate-600">
                    Catat manual di buku, bisa rusak atau hilang.
                </div>
            </div>
            <div class="flex items-start gap-2">
                <ion-icon name="close-circle-outline" class="text-red-500 text-2xl"></ion-icon>
                <div class="text-sm text-slate-600">
                    Salah kulakan, stok macet.
                </div>
            </div>
            <div class="flex items-start gap-2">
                <ion-icon name="close-circle-outline" class="text-red-500 text-2xl"></ion-icon>
                <div class="text-sm text-slate-600">
                    Keuntungan Dimanipulasi
                </div>
            </div>
            <div class="flex items-start gap-2">
                <ion-icon name="close-circle-outline" class="text-red-500 text-2xl"></ion-icon>
                <div class="text-sm text-slate-600">
                    Sisa banyak karena tidak tahu kapan hari sepi, kapan ramai.
                </div>
            </div>

        </div>
        <div class="p-10 mobile:p-8 rounded-lg border flex flex-col gap-4 bg-primary text-white">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex items-center justify-center border border-white rounded-full">
                    <ion-icon name="checkmark-outline" class="text-xl text-white"></ion-icon>
                </div>
                <h4 class="text-lg text-white font-medium">Pakai Takotoko</h4>
            </div>

            <div class="flex items-start gap-2 mt-4">
                <ion-icon name="checkmark-circle-outline" class="text-white text-2xl"></ion-icon>
                <div class="text-sm white">
                    Stok, Struk, semuanya online terintegrasi.
                </div>
            </div>
            <div class="flex items-start gap-2">
                <ion-icon name="checkmark-circle-outline" class="text-white text-2xl"></ion-icon>
                <div class="text-sm white">
                    Tau mana yang cepat laku, mana yang harus restok.
                </div>
            </div>
            <div class="flex items-start gap-2">
                <ion-icon name="checkmark-circle-outline" class="text-white text-2xl"></ion-icon>
                <div class="text-sm white">
                    Laporan instan, akurat berdasarkan data.
                </div>
            </div>
            <div class="flex items-start gap-2">
                <ion-icon name="checkmark-circle-outline" class="text-white text-2xl"></ion-icon>
                <div class="text-sm white">
                    Pelayanan Prima, Pelanggan Bertambah
                </div>
            </div>
        </div>
    </div>
</section>

<section class="p-20 mobile:px-8 grid grid-cols-2 mobile:grid-cols-1 gap-4 mobile:gap-10 bg-white">
    <div class="flex flex-col items-center">
        <img src="/images/hero_home_2.jpeg" alt="Hero home2" class="bg-slate-200 rounded-2xl aspect-[9/16] w-7/12 mobile:w-full object-cover">
    </div>
    <div class="flex flex-col gap-6 pt-8">
        <h3 class="text-4xl mobile:text-2xl text-slate-800 font-bold leading-[48px]">Didesain dari <span class="text-orange-500 underline">Pengalaman UMKM</span> sesungguhnya.</h3>
        <div class="text-slate-600 mobile:text-sm">
            Bukan sekedar pencatatan, bukan asumsi, semua didesain untuk menyelesaikan masalah nyata yang dialami pelaku UMKM.
        </div>

        <div></div>

        <div class="flex items-center gap-6">
            <div class="min-w-16 min-h-16 rounded-xl flex items-center justify-center bg-red-500">
                <ion-icon name="scan-outline" class="text-2xl text-white"></ion-icon>
            </div>
            <div class="flex flex-col gap-1 grow">
                <h4 class="text-lg mobile:text-sm text-slate-800 font-medium">Catat jualan tanpa ngetik atau melototin list produk.</h4>
                <div class="text-sm mobile:hidden text-slate-600">
                    Jepret produk di depanmu dan sistem yang akan mencari.
                </div>
            </div>
        </div>
        <div class="flex items-center gap-6">
            <div class="min-w-16 min-h-16 rounded-xl flex items-center justify-center bg-green-500">
                <ion-icon name="cash-outline" class="text-2xl text-white"></ion-icon>
            </div>
            <div class="flex flex-col gap-1 grow">
                <h4 class="text-lg mobile:text-sm text-slate-800 font-medium">Nunjukin hari ini kamu untung berapa.</h4>
                <div class="text-sm mobile:hidden text-slate-600">
                    Marginmu akan langsung kelihatan setelah mencatat pembelian.
                </div>
            </div>
        </div>
        <div class="flex items-center gap-6">
            <div class="min-w-16 min-h-16 rounded-xl flex items-center justify-center bg-blue-500">
                <ion-icon name="cube-outline" class="text-2xl text-white"></ion-icon>
            </div>
            <div class="flex flex-col gap-1 grow">
                <h4 class="text-lg mobile:text-sm text-slate-800 font-medium">Bantu tau nanti harus restok apa.</h4>
                <div class="text-sm mobile:hidden text-slate-600">
                    Catat keluar - masuk produk stokmu, termasuk bahan atau bumbu.
                </div>
            </div>
        </div>
        <div class="flex items-center gap-6">
            <div class="min-w-16 min-h-16 rounded-xl flex items-center justify-center bg-amber-500">
                <ion-icon name="time-outline" class="text-2xl text-white"></ion-icon>
            </div>
            <div class="flex flex-col gap-1 grow">
                <h4 class="text-lg mobile:text-sm text-slate-800 font-medium">Paham kapan jam paling ramai.</h4>
                <div class="text-sm mobile:hidden text-slate-600">
                    Siapkan stok dan tim lebih pas biar nggak keteteran
                </div>
            </div>
        </div>
    </div>
</section>

<section class="p-20 mobile:p-8 grid grid-cols-3 mobile:grid-cols-2 gap-14 mobile:gap-8 mt-12">
    <div class="flex flex-col gap-2">
        <div class="w-20 h-20 flex items-center justify-center rounded-lg bg-green-100">
            <ion-icon name="calculator-outline" class="text-4xl text-green-500"></ion-icon>
        </div>
        <h4 class="text-lg text-slate-800 font-medium mt-4">Point of Sales</h4>
        <div class="text-sm mobile:text-xs text-slate-600 leading-7">
            Aplikasi kasir dengan kecerdasan buatan memungkinkan input produk jadi simpel.
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <div class="w-20 h-20 flex items-center justify-center rounded-lg bg-blue-100">
            <ion-icon name="cube-outline" class="text-4xl text-blue-500"></ion-icon>
        </div>
        <h4 class="text-lg text-slate-800 font-medium mt-4">Manajemen Stok</h4>
        <div class="text-sm mobile:text-xs text-slate-600 leading-7">
            Kelola stok masuk, keluar, dan opname kuantitas produk. 
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <div class="w-20 h-20 flex items-center justify-center rounded-lg bg-red-100">
            <ion-icon name="cart-outline" class="text-4xl text-red-500"></ion-icon>
        </div>
        <h4 class="text-lg text-slate-800 font-medium mt-4">Kulakan</h4>
        <div class="text-sm mobile:text-xs text-slate-600 leading-7">
            Catat bahan dari supplier dan hitung pengeluaran secara instan.
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <div class="w-20 h-20 flex items-center justify-center rounded-lg bg-orange-100">
            <ion-icon name="storefront-outline" class="text-4xl text-orange-500"></ion-icon>
        </div>
        <h4 class="text-lg text-slate-800 font-medium mt-4">Multi Cabang</h4>
        <div class="text-sm mobile:text-xs text-slate-600 leading-7">
            Buat toko untuk semua cabang yang kamu handle.
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <div class="w-20 h-20 flex items-center justify-center rounded-lg bg-cyan-100">
            <ion-icon name="people-outline" class="text-4xl text-cyan-500"></ion-icon>
        </div>
        <h4 class="text-lg text-slate-800 font-medium mt-4">Pantau Karyawan dan Kehadiran</h4>
        <div class="text-sm mobile:text-xs text-slate-600 leading-7">
            Delegasi karyawan sesuai peranan mereka. Ukur performa kinerja mereka.
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <div class="w-20 h-20 flex items-center justify-center rounded-lg bg-purple-100">
            <ion-icon name="bar-chart-outline" class="text-4xl text-purple-500"></ion-icon>
        </div>
        <h4 class="text-lg text-slate-800 font-medium mt-4">Laporan Akurat</h4>
        <div class="text-sm mobile:text-xs text-slate-600 leading-7">
            Informasi tentang jualanmu, lengkap dan akurat sesuai data.
        </div>
    </div>
</section>
@endsection