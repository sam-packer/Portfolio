<script lang="ts">
    import {crossfade, fade} from 'svelte/transition';
    import {cubicOut} from 'svelte/easing';
    import DetailedExperience from './DetailedExperience.svelte';
    import SummaryExperience from "@components/SummaryExperience.svelte";

    // Handle transitions "fading" between one tab to the other
    const contentKey: string = "experience-content";

    const [send, receive] = crossfade({
        duration: 300,
        fallback(node: Element) {
            return fade(node, {duration: 300});
        },
        easing: cubicOut
    });

    const storageKey: string = "onSummaryTab";

    // Initialize with value from localStorage if it exists
    let initialValue: boolean = false;

    if (typeof localStorage !== 'undefined') {
        const storedValue: string | null = localStorage.getItem(storageKey);
        if (storedValue !== null) {
            initialValue = storedValue === "true";
        }
    }

    // Set summary to the value if it's in local storage, or the default if not
    export let summary: boolean = initialValue;

    // Update localStorage whenever toggle is flipped
    $: {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(storageKey, summary.toString());
        }
    }
</script>

<div class="flex space-x-2 items-center mb-4">
    <label class="flex items-center space-x-2 cursor-pointer">
        <p>Detailed</p>
        <input type="checkbox" bind:checked={summary} class="toggle toggle-primary"/>
        <p>Bullet points</p>
    </label>
</div>

<div class="relative">
    {#if summary}
        <div
                class="w-full absolute top-0 left-0"
                in:receive={{key: contentKey}}
                out:send={{key: contentKey}}
        >
            <SummaryExperience/>
        </div>
    {:else}
        <div
                class="w-full absolute top-0 left-0"
                in:receive={{key: contentKey}}
                out:send={{key: contentKey}}
        >
            <DetailedExperience/>
        </div>
    {/if}
</div>

<!-- Add spacer div to maintain page layout -->
<div class="invisible">
    {#if summary}
        <SummaryExperience/>
    {:else}
        <DetailedExperience/>
    {/if}
</div>