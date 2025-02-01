<script lang="ts">
    import {fade} from 'svelte/transition';
    import {tick} from "svelte";
    import {Turnstile} from 'svelte-turnstile';

    let responseMessage: string | null = null;
    let loading: boolean = false;
    let success: boolean = false;
    let isVisible: boolean = false;

    let form: HTMLFormElement | null = null;

    async function submit(e: SubmitEvent) {
        if (form == null) {
            return;
        }

        loading = true;
        e.preventDefault();

        // Introduce an artificial delay to make it feel like the form is "processing"
        await new Promise(resolve => setTimeout(resolve, 2000));

        const formData = new FormData(form);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {"Content-Type": "application/json", "Accept": "application/json"},
            });

            const data = await response.json();
            success = true;
            responseMessage = data.message;
        } catch (error) {
            success = false;
            responseMessage = "An error occurred while submitting the form.";
        }

        isVisible = true;
        await tick();

        if (success) {
            form.reset();
        }

        loading = false;

        setTimeout(() => {
            isVisible = false;
            responseMessage = null;
            success = false;
        }, 5000);
    }
</script>

<form bind:this={form} on:submit={submit} id="contactForm">
    <div class="form-control mt-3">
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
    <div class="form-control mt-3">
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
    <div class="form-control mt-3">
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
    <Turnstile class="mt-3" siteKey="0x4AAAAAAA6W-c17eoXkcFQO"/>
    <div class="form-control">
        <button type="submit" class="btn btn-primary btn-lg mt-3">
            <span class="{loading ? 'loading loading-spinner loading-lg' : ''}"></span>
            {loading ? "Sending..." : "Send Message"}
        </button>
    </div>
    {#if isVisible}
        <div transition:fade class={success ? "alert alert-success mt-3" : "alert alert-error mt-3"}>
            {responseMessage}
        </div>
    {/if}
</form>