<script>
    import {onMount} from "svelte";

    onMount(() => {

        function attachEventListeners() {
            document.querySelectorAll("[data-event]").forEach((element) => {
                if (!element.dataset.tracked) { // Prevent duplicate event listeners
                    element.dataset.tracked = "true";

                    element.addEventListener("click", function (event) {
                        const eventName = element.getAttribute("data-event");

                        if (window.plausible && eventName) {
                            window.plausible(eventName);
                        }
                    });
                }
            });
        }

        attachEventListeners(); // Attach initially

        // Watch for new elements (for client-side navigation)
        const observer = new MutationObserver(() => attachEventListeners());
        observer.observe(document.body, {childList: true, subtree: true});
    });
</script>
