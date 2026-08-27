# KarigarSetu

A digital profile & marketplace platform for Indian traditional craftsmen —
built as a real, running Next.js + Supabase app, not a mockup.

## 📍 VERSION MARKER: "Text Interface" — complete

This checkpoint is the **Text Interface** implementation: the full
traditional forms-and-buttons UI, covering every MUST-HAVE workflow from
the architecture doc, in three languages. Per the architecture doc's core
principle ("one app, three interfaces"), this is not one of three separate
apps — it's the single shared domain layer and data model that **Icon Mode**
and **Voice Mode** will be built on top of next, reusing every server
action and domain function below rather than duplicating logic.

If you're picking this project back up later: this is the version to treat
as the stable baseline. Everything from here forward (Icon Mode, Voice
Mode, more languages, real marketplace API wiring) should be additive on
top of this, not a rewrite of it.

## What's implemented (Text Interface)

**Craftsman side**
- Registration (5-step wizard: Account → Craftsman Info → Business Info →
  Craft Info → Recognition), login, logout, session handling
- Profile editing: all fields, public/private visibility toggles for
  GST/registration number, publish/unpublish
- Awards & GI tags: add/remove, correctly start `unverified` until admin
  review
- Product management: full CRUD, publish/unpublish, stock quantity
- Craftsman dashboard: profile completion checklist, verification status,
  quick-action tiles
- Catalogue sync: Amazon/Flipkart connection UI and per-product listing
  status, built on a real adapter interface — **stubbed pending actual
  seller API credentials**, honestly labeled as such throughout the UI
  rather than faking a live connection

**Customer side**
- Public profile pages (SSR, SEO metadata, Open Graph tags) at
  `/craftsman/[slug]`
- Product display, awards, verification/GI badges
- Contact via WhatsApp click-to-chat, Call, Share, downloadable QR code
- Discover/search page with craft-category and state filters

**Platform-wide**
- Full Hindi/Bengali/English language toggle (`locales/*.json` +
  `lib/i18n/`), applied across every page including deep edit forms —
  not just chrome/navigation
- Distinctive design system (khadi-cotton + indigo-dye + turmeric palette,
  Fraunces/IBM Plex Sans type) — see `app/globals.css`
- Row Level Security on every table; Supabase SSR session middleware
- Mobile-first, accessible form patterns throughout

## What's intentionally NOT in this version

- **Icon Mode** and **Voice Mode** — the other two required interfaces.
  Not started yet.
- **Order/enquiry system** (architecture doc Phase 7) — customers can
  contact a craftsman but there's no order-tracking data model yet.
- **Admin dashboard** (Phase 8) — no verification review UI yet; awards/GI
  tags/registration all sit in `unverified` until that's built.
- **Real photo upload** — image fields are URL text inputs, not a
  Supabase Storage uploader.
- **Real Amazon/Flipkart API integration** — the adapter interface and UI
  are complete; the adapters themselves return "pending" until real seller
  credentials are wired in (see `lib/marketplace/adapters/*.ts` for exactly
  what each platform still needs).
- **PWA** (Phase 13), automated test suite (Phase 14).

## Running it

1. Create a free Supabase project.
2. Copy `.env.example` → `.env.local`, fill in your project URL/anon key.
3. Run every file in `supabase/migrations/` (in numeric order) in the
   Supabase SQL editor, then `supabase/seed.sql`.
4. `npm install && npm run dev`

## Project history

This repo is git-tracked from this checkpoint forward. See `git log` and
tags for how it evolved — tag `text-interface-v1` marks this exact state.
