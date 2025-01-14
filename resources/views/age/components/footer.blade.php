<div class="bg-white p-20 mobile:p-10 border-t flex mobile:flex-col gap-20 mobile:gap-10">
    <div class="flex flex-col gap-4 grow">
        <a href="{{ route('age.index') }}" class="flex">
            <img src="{{ asset('images/age/logo.png') }}" alt="Logo footer" class="h-20">
        </a>
        <h4 class="font-medium mt-2">CV Anugrah Gemilang Erajaya</h4>
        <div class="text-slate-500 text-sm leading-8">
            Jl. Graha Anggrek Mas No.C-31, Prapatan, Pagerwojo, Kec. Buduran, Kabupaten Sidoarjo, Jawa Timur 
        </div>
        <div class="text-slate-400 text-xs">
            &copy; 2018 - {{ date('Y') }} AGE Creative - All Rights Reserved
        </div>
    </div>
    <div class="flex flex-col basis-4/12">
        <div class="font-medium mb-4 px-4">Layanan</div>
        <a href="{{ route('age.service.eventManagement') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            <ion-icon name="calendar-outline"></ion-icon>
            Event Management
        </a>
        <a href="{{ route('age.service.production') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            <ion-icon name="cog-outline"></ion-icon>
            Production
        </a>
        <a href="{{ route('age.service.advertising') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            <ion-icon name="volume-high-outline"></ion-icon>
            Advertising
        </a>
        <a href="{{ route('age.service.eventEquipment') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            <ion-icon name="hammer-outline"></ion-icon>
            Event Equipment
        </a>
        <a href="{{ route('age.service.procurementGoods') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            <ion-icon name="clipboard-outline"></ion-icon>
            Procurement Goods
        </a>
    </div>
    <div class="flex flex-col basis-4/12">
        <div class="font-medium mb-4 px-4">Laman</div>
        <a href="{{ route('age.about') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            About Us
        </a>
        <a href="{{ route('age.about') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            Our Clients
        </a>
        <a href="{{ route('age.about') }}" class="py-3 px-4 hover:bg-gray-100 rounded-lg whitespace-nowrap text-sm text-slate-600 flex items-center gap-4">
            Contact Us
        </a>
    </div>
</div>