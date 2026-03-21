---
layout: ../layouts/AboutLayout.astro
title: "Uses"
---

Tools I actually use. If something has an affiliate link, I say so. I only list things I would recommend without the commission.

## Analytics

### Simple Analytics

Simple Analytics is the analytics tool running on this site. I switched to it because I wanted traffic data without the privacy implications of Google Analytics. No cookies and no consent banners required.

What's good: the script is tiny (under 3 kB), loads fast, and does not touch your visitors' data. The dashboard is deliberately simple — page views, referrers, top pages, browser and country breakdown. That is all I need. Data is stored in the EU, GDPR compliant by design, and you can make your dashboard public if you want. The pricing is reasonable for an indie blog.

What's not great: if you need funnel analysis, custom event funnels, or the kind of cohort reporting that Plausible or Fathom offer, Simple Analytics falls short. The event tracking API exists but it is more limited. The ecosystem and integrations are smaller than the established players.

Who it's for: developers and bloggers who want to know where their traffic comes from without running surveillance infrastructure. If you care about your visitors' privacy, it is the most principled option I have found that still gives you useful numbers.

[Try Simple Analytics](https://www.simpleanalytics.com/?referral=kequq) — _affiliate link_. Simple Analytics gives 50% of the first year's revenue to referrers. The price you pay is the same either way.

## Infra & Developer Tools

### Cloudflare

CDN and DNS for most of my projects. The free tier covers a lot of ground — DNS management, basic DDoS mitigation, and caching. I use it for this site's DNS. No affiliate program I use here, just a tool that works and does not cost me anything at the scale I operate.

## Self-hosted (no affiliate links)

These are tools I run on my own infrastructure. None have affiliate programs, or I have not looked into it — I list them because they are part of the stack and might be useful to someone.

- **Uptime Kuma** — lightweight monitoring with a clean UI. I use it to watch services on my home server.
- **Vaultwarden** — open-source Bitwarden server implementation. Self-hosted password management.
- **SearXNG** — private metasearch engine. I run an instance for personal use instead of feeding queries to commercial search engines.

---

This page is updated when my stack changes. Last updated: March 2026.
