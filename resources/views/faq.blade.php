@extends('layouts.page')

@section('title', "FAQ")

@section('content')
    
<section class="p-20 mobile:p-8 bg-white flex flex-col gap-8">
    <div class="flex items-center gap-4">
        <div class="flex flex-col gap-2 grow">
            <div class="text-xs text-primary">Frequently Asked Question</div>
            <h2 class="text-4xl text-slate-800 font-medium">Pertanyaan Umum</h2>
        </div>
        <div class="border rounded-lg p-3">
            <div class="text-xs text-slate-500 mb-1">Topik</div>
            <select name="topic" id="topic" class="outline-none text-sm text-slate-800 cursor-pointer">
                @foreach ($topics as $top)
                    <option value="{{ $top }}">{{ $top }}</option>
                @endforeach
            </select>
        </div>
    </div>

    @foreach ($faqs as $f => $faq)
        <div class="border rounded-lg cursor-pointer p-8 flex flex-col gap-4 FAQItem" id="faq_{{ Str::slug($faq->question, '_') }}" onclick="toggleFAQ('#faq_{{ Str::slug($faq->question, '_') }}')">
            <div class="flex items-center gap-4">
                <h3 class="text-xl text-slate-800 flex grow">{{ $faq->question }}</h3>
                <div class="p-1 rounded-full flex items-center justify-center border">
                    <div class="w-4 h-4 {{ $f == 0 ? 'bg-primary' : '' }} rounded-full FAQDot"></div>
                </div>
            </div>

            <div class="text-sm FAQAnswer {{ $f == 0 ? '' : 'hidden' }}">
                {{ $faq->answer }}
            </div>
        </div>
    @endforeach
</section>

@endsection

@section('javascript')
<script>
    const toggleFAQ = target => {
        selectAll(".FAQItem .FAQAnswer").forEach(item => item.classList.add('hidden'));
        selectAll(".FAQItem .FAQDot").forEach(item => item.classList.remove('bg-primary'));
        select(`${target} .FAQAnswer`).classList.remove('hidden');
        select(`${target} .FAQDot`).classList.add('bg-primary');
    }
</script>
@endsection