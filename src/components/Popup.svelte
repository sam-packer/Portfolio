<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import dayjs from "dayjs";
    import utc from "dayjs/plugin/utc";
    import timezone from "dayjs/plugin/timezone";

    dayjs.extend(utc);
    dayjs.extend(timezone);

    interface Popup {
        id: string;
        title: string;
        message: string;
        linkText: string;
        link: string;
        eventDate: string;
        location: string;
        startDate: string;
        endDate: string;
    }

    // Pass the popups in from the component
    export let popups: Popup[] = [];
    let activePopup: Popup | null = null;
    let localEventDate: string = "";

    // Finds a user's cookie by name
    const getCookie = (name: string): string | null => {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find(row => row.startsWith(name + "="));
        return cookie ? cookie.split("=")[1] : null;
    };

    // Add a new cookie to track whether a popup has been seen with an expiration date of 30 days
    const setCookie = (name: string, value: string, days: number): void => {
        const expires = dayjs().add(days, 'day').utc().toString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    };

    /* This optimization stores the JSON response in browser storage for an hour
    This is faster than loading the JSON on every page load and filtering it out
    We must use the user's session storage because this needs to run on the client side
    */
    const checkPopup = (): void => {
        const now = dayjs().utc();
        const cacheKey = "popup_cache";

        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            const {popups: cachedPopups, lastChecked} = JSON.parse(cachedData) as {
                popups: Popup[],
                lastChecked: string
            };
            const lastCheckedTime = dayjs(lastChecked);

            if (now.diff(lastCheckedTime, "minute") < 60) {
                processPopups(cachedPopups);
                return;
            }
        }

        // If there is no cache or the cache is older than an hour, then we can filter the popups by date
        const validPopups = popups.filter(p => {
            const startTime = dayjs.utc(p.startDate);
            const endTime = dayjs.utc(p.endDate);
            return now.isAfter(startTime) && now.isBefore(endTime);
        });

        sessionStorage.setItem(cacheKey, JSON.stringify({popups: validPopups, lastChecked: now}));

        processPopups(validPopups);
    };

    // Checks to see if the user has already seen the popup. If they haven't seen it, then we display it
    const processPopups = (validPopups: Popup[]): void => {
        for (const popup of validPopups) {
            if (!getCookie(`popup_seen_${popup.id}`)) {
                activePopup = popup;

                if (activePopup.eventDate) {
                    localEventDate = dayjs.utc(activePopup.eventDate).local().format("dddd, MMM D, h:mm A");
                }

                window.addEventListener("keydown", handleKeyDown);
                return;
            }
        }
    };

    // Closes the popup and adds a cookie to mark the user has seen it
    const closePopup = (): void => {
        if (activePopup) {
            setCookie(`popup_seen_${activePopup.id}`, "true", 30);
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

    // Allow them to click outside of the popup overlay to close it
    const handleOutsideClick = (event: MouseEvent): void => {
        if ((event.target as HTMLElement).classList.contains("popup-overlay")) {
            closePopup();
        }
    };

    onMount(checkPopup);

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeyDown);
    });
</script>

{#if activePopup}
    <div on:click={handleOutsideClick} on:keydown={handleKeyDown} role="dialog" aria-modal="true"
         aria-labelledby="popup-title" aria-describedby="popup-message" tabindex="-1"
         class="fixed inset-0 flex items-center justify-center bg-black/50 px-2 md:px-0 z-50 popup-overlay"
         transition:fade={{duration: 150}}
    >
        <div class="card card-border card-xl bg-base-100 w-140">
            <div class="card-body">
                <div class="card-actions justify-between items-center mb-2">
                    <h2 id="popup-title" class="card-title">{activePopup.title}</h2>
                    <button on:click={closePopup} class="btn btn-square btn-sm" aria-label="Close">
                        <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill=currentColor;
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                            <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <p id="popup-message">
                    {@html activePopup.message.replace(/\n/g, "<br>")}
                </p>

                {#if activePopup.eventDate || activePopup.location}
                    <div class="pt-2">
                        <p>
                            {#if activePopup.eventDate}
                                📅 Date: {localEventDate}
                            {/if}
                            <br>
                            {#if activePopup.location}
                                💻 Where: {activePopup.location}
                            {/if}
                        </p>
                    </div>
                {/if}
                <div class="card-actions justify-end mt-2">
                    <button on:click={closePopup} id="popup-button" class="btn btn-primary rounded-lg">
                        <a href={activePopup.link} target="_blank">{activePopup.linkText}</a>
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
