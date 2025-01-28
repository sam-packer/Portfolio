<script lang="ts">
    import {fade} from 'svelte/transition';

    let responseMessage: string | null = null;
    let success: boolean;
    let isVisible = false;

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await fetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {"Content-Type": "application/json", "Accept": "application/json"},
        }).then(async (response) => {
            const data = await response.json();
            success = response.status === 200;
            responseMessage = data.message;
        }).catch((error) => {
            success = false;
            responseMessage = error || "An error occurred while submitting the form.";
        }).then(function () {
            isVisible = true;
            setTimeout(() => isVisible = false, 5000);
            if (success) {
                form.reset();
            }
        });
    }
</script>

<form on:submit={submit} id="contactForm">
    <div class="form-control">
        <label class="label" for="name">
            <span class="label-text">Your Name</span>
        </label>
        <input
                type="text"
                id="name"
                name="name"
                class="input input-bordered w-full"
                placeholder="Enter your name"
                required
        />
    </div>
    <div class="form-control">
        <label class="label" for="email">
            <span class="label-text">Your Email</span>
        </label>
        <input
                type="email"
                id="email"
                name="email"
                class="input input-bordered w-full"
                placeholder="Enter your email"
                required
        />
    </div>
    <div class="form-control">
        <label class="label" for="message">
            <span class="label-text">Your Message</span>
        </label>
        <textarea
                id="message"
                name="message"
                class="textarea textarea-bordered w-full"
                placeholder="Enter your message"
                rows="5"
                required
        ></textarea>
    </div>
    <div class="cf-turnstile mt-3" id="turnstile-container"></div>
    <div class="form-control">
        <button type="submit" class="btn btn-primary mt-3">Send Message</button>
    </div>
    {#if isVisible}
        <div class="mt-3" transition:fade>
            {#if success}
                <p class="alert alert-success">{responseMessage}</p>
            {:else if !success && responseMessage != null}
                <p class="alert alert-error">{responseMessage}</p>
            {/if}
        </div>
    {/if}
</form>