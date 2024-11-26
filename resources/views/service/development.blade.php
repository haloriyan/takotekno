@extends('layouts.page')

@section('title', "Pengembangan Perangkat Lunak - ")
    
@section('content')
<div class="bg-primary text-white p-20 py-56 mobile:p-10 mobile:py-36 flex gap-20 relative">
    <div class="w-7/12 mobile:w-full flex flex-col gap-6">
        <h2 class="text-4xl mobile:text-xl mobile:leading-10 font-medium">
            Pengembangan Perangkat Lunak Kustom yang Skalabel dan Ramah Pengguna
        </h2>
        <div class="leading-8  text-lg mobile:text-sm">
            Kami membantu bisnis Anda dalam menyederhanakan proses, meningkatkan efisiensi, dan menciptakan pengalaman pengguna yang maksimal.
        </div>
    </div>
    <div class="flex grow"></div>
</div>

<div class="p-20 mobile:p-10 flex flex-col gap-4 items-center mobile:items-start">
    <h3 class="text-3xl text-primary font-medium">Solusi yang Menyesuaikan Kebutuhan</h3>
    <p class="text-slate-600">Anggarkan hanya untuk yang dibutuhkan, minimalkan pengeluaran</p>
    <div class="w-full mt-4 flex flex-wrap items-center gap-4 justify-center mobile:hidden">
        @foreach ($types as $item)
            <div class="rounded-full p-2 px-4 bg-white border text-sm flex items-center gap-2">
                {!! $item['icon'] !!}
                <div class="text-slate-500 mobile:text-xs">{{ $item['label'] }}</div>
            </div>
        @endforeach
    </div>

    <div class="desktop:hidden flex flex-col gap-6 mt-4">
        @foreach ($types as $item)
            <div class="flex items-center gap-4">
                {!! $item['icon'] !!}
                <div class="text-xs text-slate-500">{{ $item['label'] }}</div>
            </div>
        @endforeach
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col items-center gap-10">
    <div class="flex flex-col gap-4">
        <h3 class="text-4xl text-primary">Berapa Biaya yang Harus Dikeluarkan?</h3>
        <div>Perkirakan estimasi biaya yang akan Anda keluarkan</div>
    </div>
    <div class="flex flex-col grow gap-4 bg-primary p-10 rounded-lg text-white mobile:w-full">
        <div class="flex mobile:flex-col items-center gap-10">
            <div class="flex flex-col gap-2">
                <div class="flex grow mobile:text-sm">Modul yang Dibutuhkan</div>
                <div class="relative group">
                    <div class="text-xs underline cursor-pointer">Apa itu modul?</div>
                    <div class="absolute hidden group-hover:flex bg-white text-primary text-xs p-2 px-4 mt-2 min-w-80 leading-6">
                        Modul adalah substansi yang ada pada aplikasi. Misal Anda ingin ada sertifikat yang bisa menuliskan nama peserta secara otomatis pada LMS, ini adalah satu modul.
                    </div>
                </div>
            </div>
            <div class="flex grow items-center justify-center gap-2 mobile:w-full">
                <ion-icon name="remove-circle-outline" class="cursor-pointer text-3xl" onclick="changeModulCount('decrease')"></ion-icon>
                <div class="flex grow justify-center" id="modulCount"></div>
                <ion-icon name="add-circle-outline" class="cursor-pointer text-3xl" onclick="changeModulCount('increase')"></ion-icon>
            </div>
        </div>

        <div class="text-center text-xs mt-4">Estimasi Biaya</div>
        <div class="text-2xl font-medium text-center" id="costEstimation">Rp 2.250.000</div>
    </div>
</div>

<div class="p-20 mobile:p-10 bg-primary-transparent">
    <h3 class="text-4xl text-primary">Apa Saja yang Akan Anda Dapatkan?</h3>

    <div class="flex flex-wrap mobile:flex-col mt-10 gap-10">
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Source Code Penuh yang Dapat Dikembangkan Lagi</h4>
            <div class="text-sm text-slate-500 leading-8">Anda tak perlu khawatir harus terikat dengan kami. Aplikasi yang kami buat selalu menggunakan sumber kode yang bersih dan rapi sehingga dapat dikembangkan lebih lanjut jika Anda memiliki programmer in-house atau ingin bekerja sama dengan agensi lainnya.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Garansi 3 Bulan</h4>
            <div class="text-sm text-slate-500 leading-8">Kami tidak berani menjamin software kami sempurna. Namun kami akan bertanggung jawab apabila ada masalah pada aplikasi setelah proses serah-terima berlangsung.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Instalasi</h4>
            <div class="text-sm text-slate-500 leading-8">Anda tak perlu bingung aplikasinya harus diapakan. Kami akan membantu instalasi hingga dapat digunakan.</div>
        </div>
        <div class="bg-white rounded-xl p-10 flex flex-col gap-4 flex-1 basis-1/3">
            <h4 class="text-primary">Pelatihan Penggunaan</h4>
            <div class="text-sm text-slate-500 leading-8">Handbook selalu tersedia untuk membantu pengguna menjalankan aplikasi. Kami juga dapat memberikan pelatihan intensif dengan kondisi dan syarat tertentu.</div>
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10">
    <div class="w-24 h-1 bg-primary"></div>
    <h3 class="text-4xl text-primary mt-10">Rencanakan Kesuksesan Anda</h3>
    <div class="flex mobile:flex-col gap-8 mt-20">
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="chatbubbles-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Diskusikan</h4>
            <div class="text-slate-600 text-sm text-center">Keluhkan semua yang menjadi rintangan dan harapan yang ingin Anda capai</div>
        </div>
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="bulb-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Brainstorming</h4>
            <div class="text-slate-600 text-sm text-center">Kami mencari solusi terbaik dan paling efisien yang dapat diterapkan</div>
        </div>
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="laptop-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Prototype</h4>
            <div class="text-slate-600 text-sm text-center">Mulai proses pembuatan aplikasi sesuai dengan apa yang Anda harapkan</div>
        </div>
        <div class="flex flex-1 flex-col items-center gap-4">
            <ion-icon name="cloud-upload-outline" class="text-5xl"></ion-icon>
            <h4 class="text-slate-700 text-lg">Luncurkan</h4>
            <div class="text-slate-600 text-sm text-center">Gunakan dan dapatkan apa yang menjadi harapan Anda</div>
        </div>
    </div>
</div>

<div class="p-20 mobile:p-10 flex mobile:flex-col gap-20 mobile:gap-10">
    <div class="flex flex-col gap-8">
        <h3 class="text-4xl text-slate-700 font-medium">Pertanyaan Umum</h3>
        <div class="text-slate-500 text-sm">Pertanyaan yang mungkin ingin Anda sampaikan</div>
    </div>
    <div class="flex flex-col gap-4 grow">
        @foreach ($faqs as $f => $faq)
            <div class="border rounded-xl p-6 flex flex-col gap-4 cursor-pointer" onclick="toggleFaq(this)">
                <div class="flex items-center gap-4">
                    <div class="flex grow text-slate-700">{{ $faq['question'] }}</div>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                </div>
                <div class="text-slate-500 text-sm {{ $f != 0 ? 'hidden' : ''}} faq-answer">{{ $faq['answer'] }}</div>
            </div>
        @endforeach
    </div>
</div>

@include('components.cta')
@include('components.clients')
@endsection

@section('javascript')
<script>
    let modulCount = 5;

    const Currency = (amount) => {
        let props = {};
        props.encode = (prefix = 'Rp', thousand_separator = ".") => {
            let result = '';
            let amountRev = amount.toString().split('').reverse().join('');
            for (let i = 0; i < amountRev.length; i++) {
                if (i % 3 === 0) {
                    result += amountRev.substr(i,3)+'.';
                }
            }
            return prefix + ' ' + result.split('',result.length-1).reverse().join('');
        }
        props.decode = () => {
            return parseInt(amount.replace(/,.*|[^0-9]/g, ''), 10);
        }

        return props;
    }

    const changeModulCount = act => {
        if (act === 'increase') {
            modulCount = modulCount + 1;
        } else {
            modulCount = modulCount - 1;
        }

        renderEstimation(
            (modulCount * 4) * 132000
        );
    }
    const renderEstimation = (cost) => {
        select("#modulCount").innerHTML = modulCount;
        select("#costEstimation").innerHTML = Currency(cost).encode();
    }

    renderEstimation(
        (modulCount * 4) * 132000
    );
</script>
@endsection