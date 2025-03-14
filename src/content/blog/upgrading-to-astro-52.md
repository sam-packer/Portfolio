---
title: "Upgrading to Astro 5.2"
description: "Learn how I upgraded to Astro 5.2 with the latest web technologies and rewrote my contact form."
pubDate: "January 31, 2025 10:45:04 AM"
image: "../../assets/blog/astro_logo.webp"
tags: [ "Web Development" ]
---

Web development is a fast-paced field, with frameworks and libraries constantly evolving. Staying up to date with your
dependencies is crucial. Neglecting them can lead to a scenario where everything breaks at once. I learned this the hard
way with the documentation site I built for [Plex](https://plex.us.org). One of my biggest mistakes was writing the
documentation directly on the server using the basic nano editor instead of a fully fledged IDE. Switching to WebStorm
was a game changer. As a JetBrains product, it’s robust and intuitive, and it has become my go-to tool for web
development. Recently, I gave the Plex documentation a major overhaul, upgrading all dependencies and rewriting outdated
content to ensure it stays relevant.

Applying the lessons I’ve learned, I’ve made it a priority to keep the dependencies for my personal portfolio up to
date. My portfolio is built with Astro, Svelte, TailwindCSS, and DaisyUI, a stack I’ll dive into in more detail in a
future post. When Astro 5.2 was released yesterday, I was eager to explore its new features and integrate them into my
project.

However, upgrading dependencies isn’t always seamless. Moving to TailwindCSS 4 introduced some challenges, particularly
with the sidebar layout. Fortunately, a few CSS tweaks resolved the issues. DaisyUI also underwent changes, notably
reducing the default button size. To maintain consistency, I switched to the large button classes to restore the
original sizing. Additionally, the upgrade required restructuring how TailwindCSS is integrated into Astro, which was a
valuable learning experience.

One of the most significant changes I made was to the contact form, though this wasn’t directly tied to the Astro 5.2
update. Originally, the form was built with vanilla HTML, CSS, and JavaScript, but I ran into persistent issues. The
static generation of the form caused problems with CAPTCHA functionality, which only worked on the initial page load. To
address this, I migrated the form to Svelte, transforming it into an "island" that generates at load time. This ensures
the CAPTCHA works reliably on every page load, not just the first.

With the Astro 5.2 update, I took the opportunity to further optimize the Svelte component. I leveraged more of Svelte’s
built-in features, moving away from vanilla JavaScript. I also added a smooth fade transition for the success alert and
improved the button’s state management. Now, when a message is being sent, the button dynamically changes from "Send
Message" to "Sending" along with a loading indicator. Once the message is sent, the button resets, providing a
more intuitive user experience with better feedback.

Keeping dependencies updated is more than just a maintenance task; it’s an opportunity to refine your codebase and
improve functionality. While upgrades can sometimes introduce challenges, they also push us to learn and adapt. By
staying proactive and embracing these changes, we can build more resilient and efficient projects.
