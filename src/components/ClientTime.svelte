<script lang="ts">
    import dayjs from "dayjs";
    import timezone from "dayjs/plugin/timezone";
    import utc from "dayjs/plugin/utc";
    import localizedFormat from "dayjs/plugin/localizedFormat";
    import {onMount} from "svelte";

    interface PostData {
        data: {
            pubDate: string;
            revDate?: string;
        };
    }

    export let post: PostData;

    dayjs.extend(utc);
    dayjs.extend(localizedFormat);
    dayjs.extend(timezone);

    const displayDate = post.data.pubDate
        ? dayjs.tz(post.data.pubDate, dayjs.tz.guess()).format("LL")
        : null;
    const updatedDate = post.data.revDate
        ? dayjs.tz(post.data.revDate, dayjs.tz.guess()).format("LL")
        : null;

    let toastMessage: string | null = null;
    let toastColor = "alert-info";

    function showToast(message: string, color = "alert-info") {
        toastMessage = message;
        toastColor = color;

        setTimeout(() => {
            toastMessage = null;
        }, 3000); // hide after 3s
    }

    let timeEl: HTMLTimeElement | null = null;

    let triggerCount = 0;
    let lastTriggerTime = 0;
    const triggerThreshold = 10;
    const triggerWindow = 1000; // ms

    function registerTrigger() {
        const now = Date.now();

        if (now - lastTriggerTime > triggerWindow) {
            triggerCount = 0;
        }

        lastTriggerTime = now;
        triggerCount++;

        if (triggerCount >= triggerThreshold) {
            const currentlyOptedOut = localStorage.plausible_ignore === "true";

            if (currentlyOptedOut) {
                localStorage.removeItem("plausible_ignore");
                showToast("You've opted back in to Plausible.", "alert-success");
            } else {
                localStorage.plausible_ignore = "true";
                showToast("You've opted out of Plausible.", "alert-error");
            }

            triggerCount = 0;
        }
    }

    onMount(() => {
        if (timeEl) {
            timeEl.addEventListener("paste", registerTrigger);
            if (window.innerWidth <= 768) {
                timeEl.addEventListener("click", registerTrigger);
            }
        }
    });
</script>

{#if displayDate && updatedDate}
    <time bind:this={timeEl}>{displayDate} (last updated on {updatedDate})</time>
{:else}
    <time bind:this={timeEl}>{displayDate}</time>
{/if}

{#if toastMessage}
    <div class="toast toast-bottom toast-center">
        <div class={`alert ${toastColor}`}>
            <span>{@html toastMessage}</span>
        </div>
    </div>
{/if}