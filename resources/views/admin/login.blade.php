@extends('layouts.auth_admin')

@section('title', "Login Admin")
    
@section('content')
<form action="{{ route('admin.login') }}" method="POST" class="flex flex-col gap-4">
    @csrf
    <h1 class="text-xl text-slate-800 font-medium">Login</h1>
    <div></div>
    <div class="group relative">
        <div class="text-xs font-medium">Email</div>
        <input value="admin@admin.com" type="email" name="email" id="email" class="w-full border-b-2 group-focus:border-b-primary outline-none h-12 text-sm" required>
    </div>
    <div></div>
    <div class="group relative">
        <div class="text-xs font-medium">Password</div>
        <input value="123123" type="password" name="password" id="password" class="w-full border-b-2 group-focus:border-b-primary outline-none h-12 text-sm" required>
    </div>

    @if ($errors->count() > 0)
        @foreach ($errors->all() as $err)
            <div class="bg-red-100 text-red-500 text-sm p-2 px-3 rounded-lg">
                {{ $err }}
            </div>
        @endforeach
    @endif

    <button class="w-full h-12 bg-primary text-white text-sm font-medium rounded-lg mt-4">
        Login
    </button>
</form>
@endsection