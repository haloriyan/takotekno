@extends('layouts.page')

@section('title', "Harga")
    
@section('content')
<section class="p-20 mobile:p-8 bg-white flex flex-col gap-8">
    <div class="flex flex-col gap-4 items-center text-center">
        <div class="text-xs text-primary">Harga</div>
        <h2 class="text-3xl text-slate-800 font-medium">Akses Fitur Paling Tepat untuk Jualanmu</h2>
    </div>

    <div class="grid grid-cols-3 mobile:grid-cols-1 gap-10">
        @foreach ($plans as $paket => $item)
            <div class="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                <div class="flex items-center gap-4">
                    <div class="flex flex-col gap-2 grow basis-32">
                        <h3 class="text-xl text-slate-800">{{ ucwords($paket) }}</h3>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                        <h4 class="text-lg text-primary">{{ currency_encode($item['price']) }}</h4>
                        <div class="text-xs text-slate-500">/ bulan</div>
                    </div>
                </div>

                {{-- <div class="h-[1px] w-full bg-slate-200"></div> --}}
                <div class="h-2"></div>

                <div class="flex items-center gap-2">
                    <div class="text-sm text-slate-500 flex grow">Jumlah Produk</div>
                    <div class="text-sm text-slate-700 font-medium flex items-center">
                        @if (gettype($item['produk']) == "string")
                            <ion-icon name="infinite" class="text-green-500 text-lg"></ion-icon>
                        @else
                            {{ $item['produk'] }}
                        @endif
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-slate-500 flex grow">Transaksi per Hari</div>
                    <div class="text-sm text-slate-700 font-medium flex items-center">
                        @if (gettype($item['transaksi']) == "string")
                            <ion-icon name="infinite" class="text-green-500 text-lg"></ion-icon>
                        @else
                            {{ $item['transaksi'] }}
                        @endif
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex flex-col grow basis-32">
                        <div class="text-sm text-slate-500">Hak Akses Karyawan</div>
                        <div class="text-xs text-slate-400">+ Absensi</div>
                    </div>
                    <div class="text-sm text-slate-700 font-medium flex items-center">
                        @if (gettype($item['karyawan']) == "string")
                            <ion-icon name="infinite" class="text-green-500 text-lg"></ion-icon>
                        @else
                            @if ($item['karyawan'] > 0)
                                {{ $item['karyawan'] }}
                            @else 
                                <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                    <ion-icon name="remove"></ion-icon>
                                </div>
                            @endif
                        @endif
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-slate-500 flex grow">Cetak Struk</div>
                    <div class="text-sm text-slate-700 font-medium flex items-center">
                        @if ($item['struk'])
                            <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <ion-icon name="checkmark"></ion-icon>
                            </div>
                        @else
                            <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                <ion-icon name="remove"></ion-icon>
                            </div>
                        @endif
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-slate-500 flex grow">Scanner & Tools AI</div>
                    <div class="text-sm text-slate-700 font-medium flex items-center">
                        @if ($item['ai'])
                            <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <ion-icon name="checkmark"></ion-icon>
                            </div>
                        @else
                            <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                <ion-icon name="remove"></ion-icon>
                            </div>
                        @endif
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-slate-500 flex grow">Unduh Laporan Excel</div>
                    <div class="text-sm text-slate-700 font-medium flex items-center">
                        @if ($item['laporan'])
                            <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <ion-icon name="checkmark"></ion-icon>
                            </div>
                        @else
                            <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                    <ion-icon name="remove"></ion-icon>
                                </div>
                        @endif
                    </div>
                </div>

                <div class="h-4"></div>
                @if ($item['price'] == 0)
                    <a href="{{ env('GPLAY_URL') }}" target="_blank" class="w-full h-12 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center gap-2">
                        Download Sekarang
                    </a>
                @else
                    <a href="https://wa.me/6285159772902?text={{ urlencode('Halo, saya ingin mendapatkan paket ' . $item['label'] . ' di aplikasi Takotoko') }}" target="_blank" class="w-full h-12 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center gap-2">
                        Dapatkan
                    </a>
                @endif
            </div>
        @endforeach
    </div>
</section>
@endsection

@section('javascript')
<script>
    // WRITE HERE IF YOU NEED SOME
</script>
@endsection