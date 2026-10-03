# Agrawal Dental Studio — Premium Dental Clinic Demo Website

A polished, multi-page demo website for a single-doctor dental clinic in Mathura, Uttar Pradesh —
**Dr. Vipin Agrawal (BDS, MDS)**. Built with pure HTML, CSS and vanilla JavaScript (no frameworks,
no build step), so it runs anywhere.

> ⚠️ Demo project. All names, prices, ratings, contact details and imagery are fictional/illustrative.

## Pages

| Page            | File           | Highlights |
|-----------------|----------------|------------|
| Home            | `index.html`   | Hero with floating badges & rotating seal, services marquee, treatment preview, why-us split, doctor spotlight, 4-step visit journey, testimonial slider, animated stats band, CTA |
| About           | `about.html`   | Clinic story, values grid, facility gallery, equipment cards, milestone timeline |
| Services        | `services.html`| 9 detailed treatment cards with starting prices, transparent-pricing promise, FAQ accordion |
| Dr. Agrawal     | `doctor.html`  | Doctor profile, philosophy quote, education & credential timeline, memberships |
| Contact / Book  | `contact.html` | Appointment request form with success state & reference ID, info cards, hours, emergency strip, landmark cards |

## Features

- Premium design system: Fraunces + Manrope typography, deep-pine / mint / gold palette
- Sticky glass header, topbar, mobile drawer nav
- Scroll-reveal animations, animated counters, hover micro-interactions
- Auto-playing testimonial slider with dots & arrows
- Smooth accordion FAQ
- Demo booking form (client-side only, generates a reference ID)
- Fully responsive, respects `prefers-reduced-motion`
- Original AI-generated imagery (`assets/img/`)

## Run it

```bash
cd dental-clinic-demo
python3 -m http.server 3000        # then open http://localhost:3000
```

Any static server works (e.g. `npx serve`, `php -S localhost:3000`).

## Structure

```
dental-clinic-demo/
├── index.html
├── about.html
├── services.html
├── doctor.html
├── contact.html
├── README.md
└── assets/
    ├── css/style.css     # design system + all components
    ├── js/main.js        # header, nav, reveal, counters, slider, accordion, form
    └── img/              # generated photography (doctor, clinic, reception, …)
```
