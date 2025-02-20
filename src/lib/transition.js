document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-event]").forEach((element) => {
        element.addEventListener("click", function (event) {
            const eventName = element.getAttribute("data-event");

            if (window.plausible && eventName) {
                window.plausible(eventName);
            }
        });
    });
});
