---
title: "Migrating from Netgear to UniFi"
description: "Upgrading my network from Netgear to UniFi came with its challenges, but the result is a faster, more reliable, and feature-rich setup that was worth the effort. Come with me through the journey of upgrading my home network!"
pubDate: "February 12, 2025 4:40:50 PM"
image: "/UniFi.jpg"
tags: [ "System Administration", "Networking" ]
---

Let’s be honest: when your Wi-Fi network works, you don’t think about it. But when it doesn’t? It’s all you can think
about. For almost two years, my network setup was one of those “set it and forget it” dreams. pfSense on a Netgate 2100
handled routing and firewall duties like a pro, while a Netgear router served as a reliable Wi-Fi access point. It was
simple, it worked, until it wasn’t enough.

The Netgear router was great for basic Wi-Fi needs, but as I started diving into VLANs and more advanced configurations,
I hit a wall. Netgear’s firmware just didn’t have the granular control I needed. I wanted to segment my network,
prioritize traffic, and have better management overall. Due to my changing needs, I decided to move over to UniFi.

I decided to pair my pfSense setup with a UniFi Flex 2.5G PoE switch and a U7 Pro Max access point. I have used UniFi
gear before, so I knew its strengths, and its limitations. While I find UniFi’s routing capabilities a bit restrictive,
their switches and access points have always impressed me. This seemed like the perfect combo for my needs.

When the hardware arrived, I was excited. I fired up the UniFi Controller, adopted the new devices, and started
configuring. At first, everything seemed to be going smoothly, until I actually tried connecting to the access point.
Devices kept dropping connections and speeds were all over the place. That was a frustrating first impression.

Since I’m no stranger to Ubiquiti products, the first thing I checked was the Band Steering setting. For those
unfamiliar, Band Steering is a feature designed to nudge devices toward the less congested 5 GHz wireless band. It
sounds great in theory, but I am familiar with UniFi and know which options with their access points tend to be
unreliable and cause more harm than good. I turned it off, and like magic, things started to stabilize. Crisis averted,
mostly...

Just when I thought I was in the clear, I noticed my UniFi AP was running *really* hot. Performance was still a bit
inconsistent, and I couldn’t figure out why. After some digging, I discovered I was running firmware version
7.0.66, which wasn’t the latest. UniFi had quietly released version 8.0.9, but it was only in the Early Access section
of their website. Once I upgraded, the difference was night and day. The AP ran cooler, performance improved, and I
finally felt satisfied with the way things were set up.

So, was it worth it? Absolutely. Migrating from Netgear to UniFi wasn’t without its headaches, but the end result is a
network that’s faster, more reliable, and packed with features that give me the control I’ve always wanted. It’s a
reminder that sometimes, you have to push through the frustration to get to the good stuff.

If you’re thinking about upgrading your own network, my advice is this: do your research, expect a few bumps in the
road, and don’t be afraid to tinker. Just remember there is a balance between practicality and overkill. When it all
comes together, there’s nothing quite like the satisfaction of a network that just works.