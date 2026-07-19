@extends('layouts.page')

@section('title', "Kebijakan Privasi")
    
@section('content')

<div class="flex justify-center p-20 mobile:p-8">
    <div class="w-7/12 mobile:w-full flex flex-col gap-6">
        <h1 class="text-4xl text-slate-800 font-medium">Kebijakan Privasi</h1>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda saat menggunakan layanan kami. Dengan mengakses dan menggunakan platform ini, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
        </div>
        
        <div></div>

        <h2 class="text-2xl text-slate-800">Informasi yang Kami Kumpulkan</h2>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Kami mengumpulkan informasi yang diperlukan untuk menyediakan dan meningkatkan layanan. Informasi ini dapat berasal dari data yang Anda berikan secara langsung maupun dari penggunaan sistem.
        </div>

        <ol class="list-decimal text-slate-600 leading-8 ps-4">
            <li>Informasi akun seperti nama, email, dan detail bisnis.</li>
            <li>Data operasional seperti transaksi, produk, inventaris, dan pelanggan.</li>
            <li>Konten yang diunggah pengguna seperti gambar produk atau media lainnya.</li>
            <li>Data teknis seperti alamat IP, perangkat, dan aktivitas penggunaan.</li>
        </ol>

        <h2 class="text-2xl text-slate-800">Penggunaan Informasi</h2>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Informasi yang dikumpulkan digunakan untuk memastikan layanan berjalan dengan baik serta untuk pengembangan fitur yang lebih relevan.
        </div>

        <ol class="list-decimal text-slate-600 leading-8 ps-4">
            <li>Menyediakan dan mengelola layanan platform.</li>
            <li>Meningkatkan performa, keamanan, dan pengalaman pengguna.</li>
            <li>Mengembangkan fitur baru berbasis analisis data.</li>
            <li>Melakukan pemrosesan otomatis untuk mendukung fitur seperti pengenalan produk atau klasifikasi data.</li>
        </ol>

        <h2 class="text-2xl text-slate-800">Pembagian Data kepada Pihak Ketiga</h2>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Dalam beberapa kondisi, kami dapat membagikan data tertentu kepada pihak ketiga untuk mendukung operasional dan pengembangan layanan. Kami memastikan bahwa pembagian ini dilakukan secara terbatas dan sesuai dengan tujuan yang relevan.
        </div>

        <ol class="list-decimal text-slate-600 leading-8 ps-4">
            <li>Gambar produk yang diunggah pengguna dapat diproses oleh layanan pihak ketiga seperti Google untuk keperluan pembelajaran mesin dan peningkatan akurasi fitur.</li>
            <li>Data teknis tertentu dapat digunakan oleh penyedia infrastruktur untuk menjaga stabilitas dan keamanan sistem.</li>
            <li>Kami tidak menjual data pribadi pengguna kepada pihak ketiga.</li>
        </ol>

        <h2 class="text-2xl text-slate-800">Penyimpanan dan Keamanan Data</h2>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Kami menerapkan langkah-langkah teknis dan organisasi untuk melindungi data Anda dari akses yang tidak sah, kehilangan, atau penyalahgunaan.
        </div>

        <ol class="list-decimal text-slate-600 leading-8 ps-4">
            <li>Data disimpan menggunakan sistem yang aman dan terkontrol.</li>
            <li>Akses terhadap data dibatasi hanya untuk pihak yang berwenang.</li>
            <li>Kami secara berkala melakukan evaluasi terhadap sistem keamanan.</li>
        </ol>

        <h2 class="text-2xl text-slate-800">Hak Pengguna</h2>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Anda memiliki kendali atas data yang Anda berikan dan berhak untuk mengelola informasi tersebut.
        </div>

        <ol class="list-decimal text-slate-600 leading-8 ps-4">
            <li>Mengakses dan memperbarui informasi akun.</li>
            <li>Meminta penghapusan data tertentu sesuai dengan ketentuan yang berlaku.</li>
            <li>Menghentikan penggunaan layanan kapan saja.</li>
        </ol>

        <h2 class="text-2xl text-slate-800">Perubahan Kebijakan</h2>
        <div class="mobile:text-sm text-slate-600 leading-8">
            Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk menyesuaikan dengan perkembangan layanan atau regulasi. Perubahan akan diinformasikan melalui platform, dan penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan terbaru.
        </div>

        <ol class="list-decimal text-slate-600 leading-8 ps-4">
            <li>Pengguna disarankan untuk meninjau kebijakan secara berkala.</li>
            <li>Perubahan berlaku sejak tanggal dipublikasikan.</li>
        </ol>
    </div>
</div>

@endsection