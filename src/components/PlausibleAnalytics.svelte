<script lang="ts">
    import {onMount} from "svelte";

    function attachEventListeners(): void {
        document.querySelectorAll("[data-event]").forEach((element) => {
            if (element instanceof HTMLElement && !element.dataset.tracked) { // Prevent duplicate event listeners
                element.dataset.tracked = "true";

                element.addEventListener("click", function (event: Event) {
                    const eventName = element.getAttribute("data-event");

                    if (window.plausible && eventName) {
                        window.plausible(eventName);
                    }
                });
            }
        });
    }

    onMount(() => {
        attachEventListeners();

        const observer = new MutationObserver(() => attachEventListeners());
        observer.observe(document.body, {childList: true, subtree: true});
    });
</script>
