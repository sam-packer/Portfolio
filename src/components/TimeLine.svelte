<script>
    export let title;
    export let subtitle;
</script>

<div class="flex flex-col my-4 first:mt-0 last:mb-0">
    <div class="flex">
        <div class="education__time">
            <span class="w-4 h-4 bg-primary block rounded-full mt-1.5 shadow-lg shadow-black"></span>
            <span class="education__line bg-primary/50 block h-full w-[2px] translate-x-[7px]"></span>
        </div>
        <div class="experience__data bd-grid px-5">
            <h3 class="font-semibold text-xl mb-1">{title}</h3>
            <span class="font-light text-sm">{subtitle}</span>
            <p class="my-2 text-left lg:text-justify">
                <slot/>
            </p>
        </div>
    </div>
</div>
