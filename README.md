# 赫兹网络 Hertz Network — static site
Pure static (no build step, no trackers, no external requests; system font stack).

Files:
- index.html — home (hero, about, services, tech stack, process, contact form)
- privacy.html — bilingual privacy policy
- style.css — styles (responsive, auto light/dark via prefers-color-scheme)
- main.js — zh/en toggle (persisted in localStorage), mobile menu, contact form → mailto
- favicon.svg / logo.svg — logo & favicon; og-image.png — social share image (1200×630)
- robots.txt / sitemap.xml — canonical base https://hertz-network.yxu2218.workers.dev/

TODO: replace placeholder `contact@example.com` with the real email in
index.html (Contact section), privacy.html (section 8, both languages) and main.js (`TO`).

Preview: `python3 -m http.server 8080` in this folder.
