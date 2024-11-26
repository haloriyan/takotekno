<div class="flex flex-col gap-2">
    @for ($i = 0; $i < $height; $i++)
        <div class="flex items-center gap-2">
            @for ($j = 0; $j < $width; $j++)
                <div class="h-2 aspect-square rounded-full {{ $color }}">
                </div>
            @endfor
        </div>
    @endfor
</div>