<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import dayjs from "dayjs";
    import utc from "dayjs/plugin/utc";
    import timezone from "dayjs/plugin/timezone";

    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Data variables
    let activePopup: any = null;
    let localEventDate: string = "";

    // Fetch the popups from the API and then process them
    onMount(async () => {
        await checkPopup();
    });

    // Finds a user's cookie by name
    const getCookie = (name: string): string | null => {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((row) => row.startsWith(name + "="));
        return cookie ? cookie.split("=")[1] : null;
    };

    // Add a new cookie to track whether a popup has been seen with an expiration date of 30 days
    const setCookie = (name: string, value: string, days: number): void => {
        const expires = dayjs().add(days, "day").utc().toString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    };

    /* This optimization stores the JSON response in browser storage so we don't make an API request
    to the /api/popups endpoint on every page load. The cache will be cleared whenever the user leaves the page
    */
    const checkPopup = async (): Promise<void> => {
        const cacheKey = "popup_cache";

        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            const {popups: cachedPopups} = JSON.parse(cachedData) as {
                popups: any[];
            };
            processPopups(cachedPopups);
        } else {
            try {
                const response = await fetch("/api/popups.json");
                if (!response.ok) {
                    return;
                }
                const popups = await response.json();
                sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({popups: popups})
                );
                processPopups(popups);
            } catch (error) {
                console.error("Failed to fetch popups:", error);
            }
        }
    };

    // Checks to see if the user has already seen the popup. If they haven't seen it, then we display it
    const processPopups = (validPopups: any[]): void => {
        for (const popup of validPopups) {
            if (!getCookie(`popup_seen_${popup.data.id}`)) {
                activePopup = popup;
                if (activePopup.data.eventDate) {
                    localEventDate = dayjs
                        .utc(activePopup.data.eventDate)
                        .local()
                        .format("dddd, MMM D, h:mm A");
                }
                window.addEventListener("keydown", handleKeyDown);
                return activePopup;
            }
        }
    };

    // Closes the popup and adds a cookie to mark the user has seen it
    const closePopup = (): void => {
        if (activePopup) {
            setCookie(`popup_seen_${activePopup.data.id}`, "true", 30);
            activePopup = null;
            window.removeEventListener("keydown", handleKeyDown);
        }
    };

    // Allow the user to press escape to close the popup
    const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            closePopup();
        }
    };

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeyDown);
    });
</script>

{#if activePopup}
    <div on:keydown={handleKeyDown} role="dialog" aria-modal="true"
         aria-labelledby="popup-title" aria-describedby="popup-message" tabindex="-1"
         class="fixed inset-0 flex items-center justify-center bg-black/50 px-2 md:px-0 z-50 popup-overlay"
         transition:fade={{duration: 150}}>
        <div class="card card-border card-xl bg-base-100">
            <div class="card-body">
                <div class="card-actions justify-between items-center mb-2">
                    <h2 id="popup-title" class="card-title">{activePopup.data.title}</h2>
                    <button on:click={closePopup} class="btn btn-square btn-sm" aria-label="Close">
                        <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                        >
                            <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <p id="popup-message">
                    {@html activePopup.rendered.replace(/\r?\n/g, "<br>")}
                </p>

                {#if activePopup.data.eventDate || activePopup.data.location}
                    <div class="pt-2">
                        <p>
                            {#if activePopup.data.eventDate}
                                📅 Date: {localEventDate}
                            {/if}
                            <br/>
                            {#if activePopup.data.location}
                                💻 Where: {activePopup.data.location}
                            {/if}
                        </p>
                    </div>
                {/if}
                <div class="card-actions justify-end mt-4">
                    <button data-event="Popup: Clicked" id="popup-button" class="btn btn-primary rounded-lg">
                        <a href={activePopup.data.link} target="_blank">{activePopup.data.linkText}</a>
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
