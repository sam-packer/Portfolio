---
title: "Inside My Home Network: A Fun Look at My Setup"
description: "A deep dive into my self-hosted network, balancing automation, security, and efficiency."
pubDate: "February 21, 2025 10:15:00 AM"
image: '../../assets/blog/Homelab.webp'
tags: [ "System Administration", "Automation", "Virtualization" ]
---

I've always been fascinated by building and optimizing my own network. It started as a simple setup, but over time, it
has evolved into something much more powerful. I figured I'd document it here for fun and maybe help someone else along
the way!

At the heart of my network is a Netgate 2100 running pfSense, acting as my router and handling everything from VLANs to
my VPN. One of its coolest features is its ability to connect with my UPS and remotely shut down every connected device
during a power outage. That kind of automation adds a layer of reliability that I really appreciate.

For switching and wireless, I use a UniFi switch and UniFi access point. My previous Netgear router worked well, but I
needed VLAN support, which led me to Ubiquiti. The UniFi interface is easy to use, but I find the routing capabilities
with UniFi gateways very limiting, hence why I use pfSense instead.

To handle virtualization, I have a mini PC running Proxmox. Initially, I planned to run Windows Server directly on it,
but after experiencing a complete domain collapse with only one domain controller, I learned my lesson. Now, I run two
Windows Server domain controllers in separate VMs, ensuring at least some redundancy (even if it's not at the hardware
level). Having a domain setup might seem excessive for a home network, but since I reinstall Windows frequently, it
makes restoring everything seamless. Group Policy takes care of configurations, making my life easier. Alongside the
domain controllers, my Proxmox setup also runs several Linux VMs, which power services like Prometheus/Grafana for
monitoring, Emby for media streaming, MySpeed to track network performance, and iVentoy for PXE booting.

Some of my most critical services run on a Raspberry Pi, ensuring core network functionality remains intact even if my
Proxmox environment goes down. I run AdGuard DNS on it, providing network-wide ad blocking and allowing me to set up
custom DNS rewrites for local services. Instead of remembering IP addresses, I can turn something like `192.168.1.15`
into `prometheus.local`, making internal services much easier to manage.

For public access to specific internal applications, I leverage `cloudflared` to create secure Cloudflare Tunnels. This
setup allows me to expose services externally while keeping them protected behind Cloudflare Access, adding an extra
layer of authentication and security.

For storage, I rely on a Synology NAS, primarily used for backups. It keeps copies of my computer and cloud server data,
ensuring multiple layers of protection against data loss. pfSense lets me have a secure VPN connection with all of my
cloud servers to my home network. This is much safer than port forwarding and having the backup software public exposed
to the internet.

This network is constantly evolving, but that’s part of what makes it so enjoyable to build and maintain. Every piece
plays a role in keeping my infrastructure stable, redundant, and efficient. Plus, the automation with my UPS and
pfSense working together to shut everything down in case of a power outage is just insanely cool. If you’re thinking of
setting up your own self-hosted environment, I highly recommend starting small and gradually expanding, it’s amazing how
quickly it can turn into something this robust!
