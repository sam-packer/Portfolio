<script>
    import {onDestroy, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import dayjs from "dayjs";
    import utc from "dayjs/plugin/utc";
    import timezone from "dayjs/plugin/timezone";
    import localizedFormat from "dayjs/plugin/localizedFormat";

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(localizedFormat);

    export let popups = [];
    let activePopup = null;
    let localEventDate = "";

    const getCookie = (name) => {
        let cookies = document.cookie.split("; ");
        let cookie = cookies.find(row => row.startsWith(name + "="));
        return cookie ? cookie.split("=")[1] : null;
    };

    const setCookie = (name, value, days) => {
        let expires = new Date();
        expires.setDate(expires.getDate() + days);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    };

    const checkPopup = () => {
        const now = dayjs().utc();

        const validPopups = popups.filter(p => {
            const startTime = dayjs.utc(p.startDate);
            const endTime = dayjs.utc(p.endDate);
            return now.isAfter(startTime) && now.isBefore(endTime);
        });

        for (let popup of validPopups) {
            if (!getCookie(`popup_seen_${popup.id}`)) {
                activePopup = popup;

                if (activePopup.eventDate) {
                    localEventDate = dayjs.utc(activePopup.eventDate).local().format("dddd, MMM D, h:mm A\t");
                }
                window.addEventListener("keydown", handleKeyDown);
                return;
            }
        }
    };

    const closePopup = () => {
        if (activePopup) {
            // This will only keep the cookie in the browser for 30 days
            setCookie(`popup_seen_${activePopup.id}`, "true", 30);
            activePopup = null;
            window.removeEventListener("keydown", handleKeyDown);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            closePopup();
        }
    };

    const handleOutsideClick = (event) => {
        if (event.target.classList.contains("popup-overlay")) {
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
