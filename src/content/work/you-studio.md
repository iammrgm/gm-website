---
title: "YOU Studio"
slug: "you-studio"
description: "Nightclubs, national brands, artist campaigns, connected products. Different rooms, same question: how do you actually reach someone?"
categories:
  - "Platform Build"
market: "departmnt"
clients:
  - name: "YOU Studio"
    url: ""
duration: "Ongoing"
location: "London"
liveUrl: ""
cover: "/images/work/you-studio/0.png"
images:
  - "/images/work/you-studio/0.png"
  - "/images/work/you-studio/1.png"
  - "/images/work/you-studio/2.png"
  - "/images/work/you-studio/3.png"
order: 4
---

## Brief

YOU Studio is a multi-floor creative and events space at 60 Hythe Road, NW10 — three studios, co-working, client suites and event floors across 36,000 square feet. The stack was the usual assembly: a Squarespace front end, third-party ticketing taking a cut of every transaction, payments handled elsewhere again, and no membership layer at all. Access was manual. Nothing connected a person walking through the building to an identity the venue could see.
Two costs, both invisible until you name them. A disjointed experience across a very large space. And a first-party audience sitting inside platforms YOU doesn't own.

## What We Built

One system, three faces. YOU, powered by DEPARTMNT.
The member portal. Application, vetting and onboarding — discipline, intent, a written statement of creative vision, portfolio uploads. Every applicant reviewed personally, so the front door doubles as curation. Then tiered membership, studio booking against a token wallet, a catering wallet, event ticketing and a tap-to-connect member directory.
The production portal. A separate B2B experience for the agencies and brands hiring Studios 1–3. Live session state — which studio, how long remaining, crew on site, the studio Wi-Fi password. Hospitality ordered mid-shoot and delivered to the floor, the green room or reception. Session history with hours and spend, exportable. Availability alerts when a cancellation opens up.
The admin CRM underneath both. Membership and studio management in one back end: applications and approvals, access permissions, bookings, token balances, hospitality orders routed to the kitchen with lead times, and every session's spend assembled for invoicing. The member sees units. The venue sees the P&L.
The hardware. TapTech cards, wristbands and resin tags as each member's physical key and identity. One credential opens a door, books a room, buys a ticket and knows who you are.

## Outcome

The instinct on a build like this is to digitise everything. We didn't.
Studio booking stays on the phone, deliberately. A production client spending five figures on a shoot doesn't want a booking form — they want their account manager, by name, on a direct line. So the portal says exactly that: call your account manager to book or amend a session. What we digitised is everything around the booking. The session runs live in the app. Hospitality goes in without breaking the shoot. History and spend assemble themselves. The relationship stays human and the admin disappears.
Three more calls made the same way:
Access. We kept the Paxton system already installed and ran UniFi Access for co-working on the venue's existing network hardware. Less elegant on a diagram, considerably cheaper, and it protected money already spent.
Payments. Stripe Connect wired to YOU's own account. Memberships and bookings settle directly to the venue rather than passing through us — a decision about who holds funds and who carries liability, made at architecture stage rather than negotiated later.
Wayfinding. The scope called for an interactive 3D floor plan, which points straight at indoor-positioning infrastructure and a large bill. The MVP uses NFC pseudo-positioning through access readers already going into the walls. The hardware was being installed anyway. We gave it a second job.
The whole build ran alongside an active fit-out. That forced a hard Phase 1 scope freeze — member directory, job board, in-portal messaging and the website migration explicitly parked. Freezing scope is the least glamorous decision here and probably the reason it's on track.
Where it stands
Soft launch to a founding cohort on an open-day model. Hardware in production, payment infrastructure coming online. Official launch Q4 2026.
