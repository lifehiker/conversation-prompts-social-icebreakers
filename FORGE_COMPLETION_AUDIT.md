# FORGE_COMPLETION_AUDIT.md

## Project: Prompt — Conversation Cards for Social Moments

---

## PRD Requirements → Implementation Mapping

### Core Product Features

| PRD Requirement | Implementation | File(s) |
|---|---|---|
| Full-screen prompt card UI | `<PromptCard>` component with swipe, click, keyboard | `src/components/PromptCard.tsx` |
| Swipe gesture (50px delta) | onTouchStart/onTouchEnd in PromptCard | `src/components/PromptCard.tsx:36-45` |
| Keyboard ArrowRight/Space | useEffect keyboard listener | `src/components/PromptCard.tsx:22-35` |
| Depth badge (LIGHT/MEDIUM/DEEP) | Color-coded badges: green/yellow/purple | `src/components/PromptCard.tsx:17-20` |
| Position indicator (Card X of Y) | Bottom-right `{order} / {total}` | `src/components/PromptCard.tsx:69-72` |
| CSS translateX transition | 200ms ease-out, no animation library | `src/components/PromptCard.tsx:54-58` |
| Pack selection page | Grid of all 6 packs with descriptions | `src/app/packs/page.tsx` |
| Pack player with LocalStorage | Client component, `prompt_pos_${id}` key | `src/app/packs/[slug]/page.tsx` |

### 6 Seeded Content Packs

| Pack | Cards | Premium | File |
|---|---|---|---|
| First Date | 50 | No (free) | `prisma/seed.ts` |
| Couples Deep Dive | 60 | Yes | `prisma/seed.ts` |
| Team Icebreaker | 40 | Yes | `prisma/seed.ts` |
| Road Trip | 35 | Yes | `prisma/seed.ts` |
| Dinner Party | 35 | Yes | `prisma/seed.ts` |
| Old Friends | 40 | Yes | `prisma/seed.ts` |

### Free Tier / Premium Gating

| PRD Requirement | Implementation | File(s) |
|---|---|---|
| First Date pack: fully free, no login | `isPremium: false` on pack; no gating logic applied | `src/app/packs/[slug]/page.tsx:62-64` |
| Premium packs: free 10, then gate | `FREE_PREVIEW_LIMIT = 10`, blocks at index 10 | `src/app/packs/[slug]/page.tsx:17,79-84` |
| Upgrade modal on card 11 | `setShowUpgrade(true)` when nextIndex >= limit | `src/app/packs/[slug]/page.tsx:82-84` |
| Upgrade modal on anonymous access to premium | Check `hasPurchase` + `isPremium` combo | `src/app/packs/[slug]/page.tsx` |

### Payments (Stripe)

| PRD Requirement | Implementation | File(s) |
|---|---|---|
| Stripe checkout session creation | POST /api/checkout, lazy init, env guard | `src/app/api/checkout/route.ts` |
| Stripe webhook handler | POST /api/webhooks/stripe, signature verify | `src/app/api/webhooks/stripe/route.ts` |
| Write Purchase record on completion | prisma.purchase.create in webhook handler | `src/app/api/webhooks/stripe/route.ts:40-48` |
| Resend confirmation email | Lazy Resend import inside webhook handler | `src/app/api/webhooks/stripe/route.ts:51-75` |
| Upgrade modal with $9.99 + $24.99 CTAs | UpgradeModal component with two tier buttons | `src/components/UpgradeModal.tsx` |
| Graceful fallback without credentials | 503 response with error message | `src/app/api/checkout/route.ts:4-8` |

### Auth

| PRD Requirement | Implementation | File(s) |
|---|---|---|
| NextAuth v5 Credentials provider | bcryptjs hash/compare | `src/lib/auth.ts` |
| JWT session strategy | `session: { strategy: "jwt" }` | `src/lib/auth.ts:16` |
| User registration | POST /api/register with bcrypt hash | `src/app/api/register/route.ts` |
| Login page | /login with register toggle | `src/app/login/page.tsx` |
| Anonymous access allowed | No auth required to access free pack | `src/app/packs/[slug]/page.tsx` |

### Co-use Room

| PRD Requirement | Implementation | File(s) |
|---|---|---|
| POST /api/rooms creates room with 6-char code | Random alphanumeric code, uniqueness check | `src/app/api/rooms/route.ts` |
| GET /api/rooms/[code] returns state | currentCardIndex, packId, packSlug | `src/app/api/rooms/[code]/route.ts` |
| PATCH /api/rooms/[code] increments index | Increments by 1, updates lastActivity | `src/app/api/rooms/[code]/route.ts` |
| /room/[code] client page with 2s polling | setInterval(2000) poll loop | `src/app/room/[code]/page.tsx:60-68` |
| "Next Card" button fires PATCH | handleAdvance in room page | `src/app/room/[code]/page.tsx` |
| "Invite Partner" copies URL | navigator.clipboard.writeText | `src/app/room/[code]/page.tsx` |
| "Start Together" button on pack player | POSTs to /api/rooms, redirects | `src/app/packs/[slug]/page.tsx:86-100` |

### PWA / Offline

| PRD Requirement | Implementation | File(s) |
|---|---|---|
| manifest.json | name, short_name, display: standalone, start_url: /app | `public/manifest.json` |
| 192×192 and 512×512 icons | Generated dark navy "P" icons | `public/icon-192.png`, `public/icon-512.png` |
| manifest link in head | `<link rel="manifest" href="/manifest.json">` | `src/app/layout.tsx:15` |
| Apple PWA meta tags | apple-mobile-web-app-capable etc. | `src/app/layout.tsx:16-19` |
| /app PWA entry point | Static page with install prompt UI | `src/app/app/page.tsx` |

### SEO Landing Pages (10 pages)

| Page | Route | Pack Used | File |
|---|---|---|---|
| Deep Conversation Questions | /deep-questions | old-friends | `src/app/deep-questions/page.tsx` |
| First Date Questions | /first-date | first-date | `src/app/first-date/page.tsx` |
| Conversation Starters for Couples | /couples | couples | `src/app/couples/page.tsx` |
| Icebreaker Questions for Work | /work-meetings | team-icebreaker | `src/app/work-meetings/page.tsx` |
| Road Trip Starters | /road-trip | road-trip | `src/app/road-trip/page.tsx` |
| Dinner Party Icebreakers | /dinner-party | dinner-party | `src/app/dinner-party/page.tsx` |
| Party Game App No WiFi | /offline | first-date | `src/app/offline/page.tsx` |
| Digital Card Game App | /card-game | first-date | `src/app/card-game/page.tsx` |
| Family Dinner Questions | /family | first-date | `src/app/family/page.tsx` |
| Remote Team Icebreakers | /remote-team | team-icebreaker | `src/app/remote-team/page.tsx` |

All SEO pages include:
- `generateMetadata()` with keyword-optimized title/description
- `export const revalidate = 86400`
- `<FreeCardPreview>` with 10 interactive cards
- `<StickyUpgradeBar>` fixed bottom CTA

### Analytics (PostHog)

| Event | Where tracked | File |
|---|---|---|
| $pageview (all pages) | PostHogPageView component | `src/components/PostHogProvider.tsx` |
| Lazy init with NEXT_PUBLIC_POSTHOG_KEY guard | Only fires when key is set | `src/components/PostHogProvider.tsx:8-9` |

### Home Page

| PRD Requirement | Implementation |
|---|---|
| Hero with headline + CTA | "The conversation app for real moments." → /packs/first-date |
| Feature grid (6 items) | 6 contexts, offline, $9.99 once, share room, three depths, zero ads |
| Pack grid (all 6 packs) | Dynamic from DB with fallback |
| Footer with SEO page links | All 10 SEO pages linked |

### Infrastructure

| Requirement | Implementation | File(s) |
|---|---|---|
| sitemap.xml | `src/app/sitemap.ts` — all routes | `src/app/sitemap.ts` |
| robots.txt | Allow all, disallow /api/ | `src/app/robots.ts` |
| Dockerfile | node:20-slim, openssl, prisma generate, db push on startup | `Dockerfile` |
| Prisma 7 CLI config in Docker | `prisma.config.ts` copied to runner stage (Prisma 7 removed url from schema.prisma) | `Dockerfile` |
| output: standalone | Confirmed in next.config.ts | `next.config.ts` |
| Zero-config startup | All SDKs guarded, defaults baked in | All API routes |

---

## Deferred External-Credential Items

These features require credentials that can't be provisioned automatically. The app runs fully without them:

1. **Stripe payments** — checkout API returns 503 with clear message; upgrade modal still displays correctly
2. **Resend emails** — webhook silently skips email send; purchase still recorded in DB
3. **PostHog analytics** — provider checks for `NEXT_PUBLIC_POSTHOG_KEY` before initializing; no crashes

See `HUMAN_INPUT_NEEDED.md` for setup instructions.

---

## Deployment Fix (2026-05-13)

**Root cause**: App failed to start in Coolify because `prisma db push` in the Docker CMD could not determine the database URL. In Prisma 7, the `url` field was removed from `schema.prisma`'s datasource block — it must live in `prisma.config.ts`. The runner stage was not copying `prisma.config.ts`, so Prisma had no URL and crashed on startup.

**Fix applied**: Added `COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts` to the Dockerfile runner stage. `prisma.config.ts` reads `DATABASE_URL` from the environment (already set as `file:/data/app.db` in the runner stage).

## Build Verification

- `npm run build`: ✅ Passes — 24 routes, 0 TypeScript errors
- Dev server: ✅ Starts on port 3000
- `/api/packs/first-date/prompts`: ✅ Returns 50 prompts
- `/api/rooms` POST: ✅ Creates room with 6-char code
- `/sitemap.xml`: ✅ Returns all URLs
- Database seed: ✅ 260 prompts across 6 packs
