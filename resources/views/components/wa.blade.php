{{-- <a
    href="https://wa.me/6285159772902?text={{ urlencode('Halo, TakoTekno. Saya [NAMA_ANDA] dari [NAMA_SEKOLAH] ingin dibantu untuk membuat aplikasi [NAMA_APLIKASI]') }}" 
    class="fixed bottom-10 right-10 bg-green-500 text-white p-3 px-6 rounded-full font-medium text-sm flex gap-2 shadow-lg"
>
    <ion-icon name="call-outline"></ion-icon>
    Hubungi Sales (Riyan)
</a> --}}

<div 
    class="fixed bottom-10 right-10 bg-green-500 text-white p-3 px-6 rounded-full font-medium text-sm flex gap-2 shadow-lg cursor-pointer"
    onclick="toggleHidden('#ContactWa')"
>
    <ion-icon name="call-outline"></ion-icon>
    Hubungi Sales (Riyan)
</div>

@section('ModalArea')
<div class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-center hidden z-50" id="ContactWa">
    <form action="{{ route('ContactWa') }}" class="bg-white shadow-lg rounded-lg p-10 w-4/12 mobile:w-10/12 flex flex-col gap-2 mt-4" method="POST">
        @csrf
        <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg text-slate-700 font-medium flex grow">Hubungi Sales</h3>
            <ion-icon name="close-outline" class="cursor-pointer text-3xl" onclick="toggleHidden('#ContactWa')"></ion-icon>
        </div>

        <div class="text-xs text-slate-500">Nama Anda</div>
        <input type="text" name="name" class="w-full h-14 border outline-0 text-sm text-slate-700 px-4" required>

        <div class="text-xs text-slate-500 mt-4">Nama Sekolah</div>
        <input type="text" name="school" class="w-full h-14 border outline-0 text-sm text-slate-700 px-4" required>

        <div class="text-xs text-slate-500 mt-4">Aplikasi Web yang Dibutuhkan</div>
        <select name="app" class="w-full h-14 border outline-0 text-sm text-slate-700 px-4">
            <option>Web Sekolah & PPDB</option>
            <option>Aplikasi PPDB</option>
            <option>Website Sekolah</option>
        </select>

        <button class="w-full h-14 bg-green-500 text-white text-sm mt-6 font-medium">Hubungi Sales</button>
    </form>
</div>
@endsection