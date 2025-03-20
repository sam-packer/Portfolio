---
title: "Understanding How Rendering Works in Web Development"
description: "Are the three different types of rendering within web development confusing you? Read this post to demystify this crucial knowledge."
pubDate: "2025-03-19T02:02:10Z"
image: "../../assets/blog/astro_rendering.webp"
tags: [ "Web Development", "Astro" ]
---

Are you confused about when to use SSR, SSG, or CSR in web development? You’re not alone. When I built my portfolio
in Astro, I started with Static Site Generation (SSG) for its speed and simplicity. But as my site grew, I realized I
needed more flexibility. I ventured into Server Side Rendering (SSR) and Client Side Rendering (CSR). Along the way, I
learned the hard way that each rendering method has its strengths, weaknesses, and ideal use cases. In this post, I’ll
break down my experience with all three, share the challenges I faced, and explain how I found the right balance for my
site. Let’s demystify these concepts together!

## Starting with Static Site Generation (SSG)

Static Site Generation is Astro’s default rendering method, and it’s fantastic for generating highly optimized static
pages at build time. This approach works perfectly for content that doesn’t change often, like my Experience and
Projects pages. The con of SSG is that if your content changes frequently, this can be a hassle. Any sort of updates
requires you to run a new build.

The simplest example that I can come up with for explaining SSG is the copyright date:

```jsx
---
const today = new Date();
---

    <footer class="footer footer-horizontal footer-center block mb-5 pt-10 pb-2">
        Copyright &copy; {today.getFullYear()} Sam Packer
    </footer>
```

Right now, it will say 2025. However, on an SSG site, it will *not* update to 2026 on the New Years. It ran the
`new Date();` at build time and substituted it in the HTML. If I want it to update to 2026, I have to rebuild the site.

## Transitioning to Server Side Rendering (SSR)

Server Side Rendering allows you to take the same code and run it when the page loads. This has the benefit of not
needing to rebuild your site if the content changes. Why would you want to use SSR? An example is a blog. If you want
posts to automatically go live at a future date, that isn't possible with SSG. You can have the code written to only
show posts that were published before the current date and time, Astro won't stop you.

```jsx
---
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const posts = (await getCollection("blog"))
    .filter(post => {
        const postDate = dayjs(post.data.pubDate).utc();
        return postDate.isBefore(currentDate, "second") || postDate.isSame(currentDate, "second");
    })
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

    {
        posts.map((post) => (
            <BlogCard
                title={post.data.title}
                img={post.data.image}
                desc={post.data.description}
                url={`/blog/${createSlug(post.data.title)}`}
                target="_self"
                badge={post.data.badge}
                referrer="blog"
                tags={post.data.tags}
            />
        ))
    }
```

However, you'll quickly notice that blog posts don't go live unless you rebuild the site. That filtering code only runs
at build time. By switching over to SSR, that filtering code will always run when the user loads the page. You can
basically think of any code enclosed in the three `---` dashes at the top as code that will run. The difference is if it
will run only at build time (SSG), or every page load (SSR).

## Adding Client Side Rendering (CSR) for Interactivity

Client Side Rendering comes into play when content needs to update dynamically in the user’s browser. The first
component I made that was CSR was my contact form. The form itself is rendered client side, but it relies on a
server side function to verify the CAPTCHA and send the email. (You wouldn’t want to trust the client to handle that
directly!)

Another great use case for CSR is a hidden feature in my portfolio: popups. Since I need to track whether a user had
seen a popup before, I store that state in a cookie. CSR was perfect for this because it’s tied directly to the user’s
browser state. While I haven't used popups yet and don't intend them to be regular, it's still a nice feature that I
coded in.

Components that are CSR are imported in the script section for Astro, but they cannot be used there. They are used in
the actual content area. Here's what the code for my contact page looks like:

```jsx
---
import ContactForm from "../components/ContactForm.svelte";
---

<h2 class="page-title">Contact</h2>
<p class="text-base">Thank you for reaching out! You may contact me using this form below. I will get back to you
    shortly. You may also contact me on LinkedIn as well.</p>

<ContactForm client:load/>
```

You may be wondering: where's the form? The form is actually inside the Svelte component. The form, CAPTCHA, and state
are all in the Svelte component. You'll notice there's a keyword `client:load` there. That means that we are explicitly
telling Astro to only load this on the client side. Why do we need to explicitly tell Astro to load this on the client?
Can't we just put the form directly in? The answer is yes, we could put it in directly. But we can't put the CAPTCHA in
directly. That runs on the client side to determine if you're a human or not. It's just easier to have the entire
contact form within the component, since we verify the CAPTCHA and also give feedback to the user that the form was
submitted successfully. There are other `client` directives, which can be found on the
[Astro documentation](https://docs.astro.build/en/reference/directives-reference/#client-directives).

## Comparing SSG, SSR, and CSR

Here’s a quick breakdown of the three rendering methods:

| Feature               | SSG (Static Site Generation)          | SSR (Server Side Rendering)                           | CSR (Client Side Rendering)                                  |
|-----------------------|---------------------------------------|-------------------------------------------------------|--------------------------------------------------------------|
| **Performance**       | Fastest, pre-generated HTML           | Slower than SSG, depends on server response time      | Slower initial load, faster navigation                       |
| **Content Freshness** | Requires rebuild for updates          | Dynamically updated per request                       | Updated dynamically on user interaction                      |
| **Server Dependency** | No server needed after build          | Requires a running server                             | No server required for rendering, but needed for APIs        |
| **SEO Benefits**      | Excellent, pre-rendered HTML          | Good, as content is server-rendered                   | Poor, content loads via JavaScript                           |
| **Best Use Cases**    | Blogs, documentation, marketing pages | User dashboards, scheduled publishing, authentication | Interactive forms, real time updates, user-specific behavior |

## Knowing Which to Use Can Be Challenging

One of the more recent issues I ran into was incorrect blog post dates. They were always displayed in UTC instead of the
user’s local timezone. My initial solution didn’t work because all the timezone logic was server side. The server can’t 
easily detect a user’s local timezone. To fix this, I moved the logic to a Svelte component that runs in the browser.
Once I did that, the dates displayed correctly for each user. Regardless, I spent hours trying to debug the issue and
why it wouldn't detect the user's timezone. Thinking "it's not running on the client" was not part of my thinking 
strategy. However, it taught me a valuable lesson and going forward I definitely have a much stronger picture of 
intuitively understanding when something should be client side.

## Finding the Right Balance

Migrating my portfolio to SSR while keeping some pages statically generated gave me a well-balanced setup. Here’s how I
use each rendering method:

- **Static Generation**: For pages that don’t change often. An example is my Experience page. Everything on it is
  updated manually.
- **Server Rendering**: For dynamic content that benefits from real time updates, like my blog with scheduled
  publishing.
- **Client Rendering**: For interactive elements that rely on user input or local state, like my contact form, popups,
  and timezone detection.

Each rendering method has its strengths and weaknesses, and learning to navigate them has been incredibly valuable. If
you’re working with Astro, understanding when to use SSG, SSR, or CSR will help you build a more efficient and flexible
site. Astro is definitely a very flexible framework, however it requires you to have a clear understanding of what runs
on the server, client, and what can be statically generated. The flexibility and control comes with a learning curve.
However, this is a learning curve that I believe is well worth it.