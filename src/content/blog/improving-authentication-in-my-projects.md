---
title: "Improving Authentication In My Projects"
description: "Rebuilding authentication in two of my applications didn’t just fix bugs, it revealed how security shapes seamless user experiences"
pubDate: "2025-05-05T19:08:15Z"
image: "../../assets/blog/authentication_header.webp"
tags: [ "Authentication" ]
---

Authentication is often dismissed as a mundane checkpoint, nothing more than a simple match of credentials. But beneath the surface lies a world of complexity, from token expiration quirks to federated systems bridging entire organizations. Recently, I dove into this intricate landscape while overhauling authentication for two projects: my Mailroom Management System and my Survey Builder. What started as a routine update turned into a surprisingly rewarding exploration of security, usability, and the hidden machinery that keeps applications secure. Here’s what I learned and why even "boring" authentication deserves a second look.

### Revamping the Mailroom Application

My Mailroom application initially relied on JWT authentication, which, while functional, fell short of modern security standards. Though passwords were hashed, critical features like refresh tokens were missing, leading to abrupt logouts after a few hours. Additionally, role or name changes required users to manually log out and back in. I knew these flaws upfront, but did not have time to fix them under the initial deadline. However, I wanted to improve the authentication and fix those flaws.

To address this, I migrated to cookie-based authentication with .NET. The transition was smoother than I expected. I replaced the complex JWT middleware with .NET’s built in claims management. By assigning claims during login and storing them in a cookie, .NET handled the heavy lifting of authorization, eliminating redundant code. The result was a leaner codebase with no disruption to existing functionality. This experience reinforced my appreciation for .NET’s developer friendly ecosystem. Despite the flaws such as being monolithic, and using Bootstrap, there are many pros with .NET for web development.

### Strengthening the Survey Builder’s OAuth2 Flow

My survey builder application integrates with OAuth2 providers like FusionAuth and Auth0. However, users faced random redirects to the login page, undermining trust in the system. The culprit ended up being unreliable session persistence.

By implementing the `offline_access` scope and refining token storage, I resolved the instability. The system now tracks refresh tokens alongside creation, expiry, and deletion dates, enabling seamless session renewal with SSO providers. This fix not only improved reliability but also deepened my understanding of OAuth2’s nuances.

### Why I Kept Authentication Methods Separate

While considering a shift to OAuth2 for the Mailroom app, I opted to use cookie-based authentication for two reasons:

1. Demonstrating Versatility: Highlighting proficiency across multiple authentication methods (JWT, cookies, OAuth2) adds value to my technical portfolio.
2. Practicality: Introducing other technologies such as SAML or Shibboleth felt excessive for a single project, though I’ve admired their role in federated systems (like university SSO networks).

### Reflections on Authentication’s Hidden Complexity

Authentication is often reduced to “matching credentials,” but its true depth lies in federation and standards like OpenID Connect. For instance, Shibboleth’s ability to unify disparate university SSO systems under one umbrella is remarkable. Similarly, OAuth2’s authorization flows reveal how layered and purposeful modern security frameworks are.

Tackling these challenges firsthand, from administrative SSO integration to hands-on token management, has been enlightening. It’s a reminder that authentication isn’t just a gatekeeper; it’s a bridge between security, usability, and scalability.

### Conclusion

Refactoring authentication in these projects wasn’t just about fixing redirects or swapping tokens, it was a lesson in balancing security with user trust. Whether simplifying a codebase with .NET’s cookie-based workflows or stabilizing OAuth2 sessions, each decision reinforced a key truth: authentication is as much about empathy (for users and developers) as it is about encryption.

As I continue exploring authentication tools, I’m reminded how these frameworks quietly shape the digital experiences we take for granted. Maybe that’s the real magic of authentication: when done right, it fades into the background, letting users focus on interacting with the application.