---
title: "Challenges of Authentication with .NET Core"
description: "This blog posts describes the challenges with getting JWT authentication working with .NET Core and Razor Pages."
pubDate: "2025-01-24T17:17:23Z"
revDate: "2025-05-05T19:08:15Z"
image: "../../assets/blog/JWT.webp"
tags: [ "ASP.NET Core", "Authentication" ]
---

*Update: This talks about my challenges with JWT authentication, however, I have since migrated this project to use cookie-based authentication. This is built-in to .NET and doesn't require custom middleware. If you're thinking about using JWT authentication in .NET, you should reconsider. It is okay to challenge your knowledge and go back to the drawing board. You can read more about it in [this blog post](/blog/improving-authentication-in-my-projects).*

Authentication is one of those things that seems simple, but it really isn’t. Recently, I ran into a challenge with ASP.NET authentication that tested my patience but ultimately made me a better developer.

It all started when I began prototyping a simple solution for user login. I figured I’d start small and see how far I could go with a static class. It worked, but only temporarily. Users could log in, and I thought I was off to the races. Then, reality hit. I discovered that with my approach, if one user logged in, **anyone else could access the site as if they were logged in too**. Not exactly a model of secure authentication.

I decided to implement JWT (JSON Web Token) authentication and turned to the Microsoft docs for guidance. It all seemed to be going well, until it wasn’t. After logging in, users immediately hit an unauthorized page.

I can’t tell you how long I wrestled with this problem. Hours of debugging. Countless searches for answers. I questioned everything I had done up to that point. It was like trying to solve a puzzle where none of the pieces seemed to fit.

Eventually, I had a breakthrough. The issue wasn’t with the JWT implementation itself; it was that the authentication cookie wasn’t being passed along with each request. I realized I needed custom middleware to solve the problem. Once that addition was in place, everything worked like a charm.

```csharp
public class TokenCookieMiddleware
{
    private readonly RequestDelegate _next;

    public TokenCookieMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (!context.Request.Headers.ContainsKey("Authorization"))
        {
            context.Request.Cookies.TryGetValue("AuthToken", out var token);
            if (!string.IsNullOrEmpty(token))
            {
                context.Request.Headers.Append("Authorization", $"Bearer {token}");
            }
        }

        await _next(context);
    }
}
```

This fetches the `AuthToken` cookie from your browser and adds the value as a header to each page. The
`AuthToken` was created with my initial JWT authentication implementation, but this made it persist throughout the application.

You can then add this line of code in your `Program.cs` entrypoint to register the middleware:

```csharp
app.UseMiddleware<TokenCookieMiddleware>();
```

Reflecting on this experience, I realized how much it mirrored the process of learning and growing as a developer:

- **You’ll hit roadblocks, and that’s normal**. Sometimes your first solution won’t work, and that’s part of the process.

- **Documentation is your friend**. But it won’t spoon-feed you the solution. You have to dig deep, connect the dots, and adapt.

- **The little things matter**. A missing piece can derail your entire app, but solving it is incredibly satisfying.

What started as a frustrating technical problem turned into a valuable learning experience that sharpened my skills and taught me patience. Challenges like this remind me why I love development; it’s about more than just solving problems. It’s about the thrill of discovery, the satisfaction of learning, and the ability to build something better than before.
