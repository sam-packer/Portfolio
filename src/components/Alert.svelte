<script lang="ts">
    import {onMount} from "svelte";
    import dayjs from "dayjs";
    import utc from "dayjs/plugin/utc";
    import timezone from "dayjs/plugin/timezone";

    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Data variables
    let activeAlerts: any[] = [];

    // Fetch the alerts from the API and then process them
    onMount(async () => {
        await checkAlert();
    });

    // Finds a user's cookie by name
    const getCookie = (name: string): string | null => {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((row) => row.startsWith(name + "="));
        return cookie ? cookie.split("=")[1] : null;
    };

    // Add a new cookie to track whether an alert has been seen with an expiration date of 30 days
    const setCookie = (name: string, value: string, days: number): void => {
        const expires = dayjs().add(days, "day").utc().toString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    };

    /* This optimization stores the JSON response in browser storage so we don't make an API request
    to the /api/alerts.json endpoint on every page load. The cache will be cleared whenever the user leaves the page
    */
    const checkAlert = async (): Promise<void> => {
        const cacheKey = "alert_cache";

        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            const {alerts: cachedAlerts} = JSON.parse(cachedData) as {
                alerts: any[];
            };
            processAlerts(cachedAlerts);
        } else {
            try {
                const response = await fetch("/api/alerts.json");
                if (!response.ok) {
                    return;
                }
                const alerts = await response.json();
                sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({alerts: alerts})
                );
                processAlerts(alerts);
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            }
        }
    };

    // Checks to see if the user has already seen the popup. If they haven't seen it, then we display it
    const processAlerts = (validAlerts: any[]): void => {
        activeAlerts = validAlerts.filter((alert) => {
            return !getCookie(`alert_seen_${alert.data.id}`);
        });
    };

    // Closes the popup and adds a cookie to mark the user has seen it
    const closeAlert = (id: string): void => {
        setCookie(`alert_seen_${id}`, "true", 30);
        activeAlerts = activeAlerts.filter(alert => alert.data.id !== id);
    };

    const getColorClass = (color: string | undefined): string => {
        switch (color) {
            case "success":
                return "alert-success";
            case "warning":
                return "alert-warning";
            case "error":
                return "alert-error";
            case "info":
                return "alert-info";
            default:
                return "";
        }
    };

    function getIconSvg(icon: string | undefined) {
        switch (icon) {
            case "check":
                return `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.49 10 10-4.49 10-10 10m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8"></path><path d="M10 16c-.26 0-.51-.1-.71-.29l-3-3L7.7 11.3l2.29 2.29 5.29-5.29 1.41 1.41-6 6c-.2.2-.45.29-.71.29Z"></path>
                </svg>
            `;
            case "alert":
                return `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M11 7h2v6h-2zM11 15h2v2h-2z"></path><path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10m0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8"></path>
                </svg>
            `;
            case "error":
                return `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M14.83 7.76 12 10.59 9.17 7.76 7.76 9.17 10.59 12l-2.83 2.83 1.41 1.41L12 13.41l2.83 2.83 1.41-1.41L13.41 12l2.83-2.83z"></path><path d="M12 2C9.33 2 6.82 3.04 4.93 4.93S2 9.33 2 12s1.04 5.18 2.93 7.07c1.95 1.95 4.51 2.92 7.07 2.92s5.12-.97 7.07-2.92S22 14.67 22 12s-1.04-5.18-2.93-7.07A9.93 9.93 0 0 0 12 2m5.66 15.66c-3.12 3.12-8.19 3.12-11.31 0-1.51-1.51-2.34-3.52-2.34-5.66s.83-4.15 2.34-5.66S9.87 4 12.01 4s4.15.83 5.66 2.34 2.34 3.52 2.34 5.66-.83 4.15-2.34 5.66Z"></path>
                </svg>
            `;
            case "info":
            default:
                return `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 11h2v6h-2zM11 7h2v2h-2z"></path>
                    <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10
                             10 10m0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8
                             3.59-8 8-8">
                    </path>
                </svg>
            `;
        }
    }
</script>

{#each activeAlerts as alert (alert.data.id)}
    <div role="alert"
         class={`alert alert-soft ${getColorClass(alert.data.color)} alert-horizontal items-start mb-4`}>
        {@html getIconSvg(alert.data.icon)}
        <div>
            <h3 class="text-lg font-bold">{alert.data.title}</h3>

            <p id="popup-message">
                {@html alert.rendered.replace(/\r?\n/g, "<br>")}
            </p>

            {#if alert.data.eventDate || alert.data.location}
                <div class="mt-1">
                    {#if alert.data.eventDate}
                        📅 {dayjs.utc(alert.data.eventDate).local().format("dddd, MMM D, h:mm A")}
                    {/if}
                    {#if alert.data.location}
                        &nbsp;| 💻 {alert.data.location}
                    {/if}
                </div>
            {/if}

            {#if alert.data.link}
                <a id="popup-button" class="btn btn-sm rounded-lg mt-2" target="_blank" data-event="Alert: Clicked">
                    {alert.data.linkText}
                </a>
            {/if}
        </div>
        <button on:click={() => closeAlert(alert.data.id)}
                data-event="Alert: Closed"
                class="btn btn-sm btn-ghost hover:btn-error"
                aria-label="Close alert">
            ✕
        </button>
    </div>
{/each}