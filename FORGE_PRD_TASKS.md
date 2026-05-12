# FORGE_PRD_TASKS.md

## Project: Prompt — Conversation Cards for Social Moments

---

## Checklist

### Foundation
- [x] Next.js 15 (App Router) + TypeScript + Tailwind CSS
- [x] shadcn/ui components (Button, Card, Dialog, Badge, Progress, Sheet, Toast, Separator)
- [x] `output: "standalone"` in next.config.ts
- [x] System fonts (no next/font/google)
- [x] Lazy SDK initialization (Stripe, Resend never at module scope)
- [x] `.env.local` with DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL
- [x] `.env.example` template

### Data Model (Prisma + SQLite)
- [x] `Pack` model: id, slug, name, description, context, isPremium, cardCount, prompts
- [x] `Prompt` model: id, packId, text, depthLevel (LIGHT/MEDIUM/DEEP), order
- [x] `User` model: id, email, password (bcrypt), name, image, createdAt
- [x] `Account`, `Session`, `VerificationToken` (NextAuth adapter models)
- [x] `Purchase` model: id, userId, stripeSessionId, tier (LIFETIME/FACILITATOR), createdAt
- [x] `Room` model: id, code (6-char unique), packId, currentCardIndex, lastActivity, createdAt
- [x] `DepthLevel` enum, `PurchaseTier` enum
- [x] `binaryTargets = ["native", "debian-openssl-3.0.x"]` in generator
- [x] Prisma v7 + libsql adapter for SQLite

### Seed Data
- [x] First Date pack: 50 prompts, isPremium: false (free tier)
- [x] Couples Deep Dive: 60 prompts, isPremium: true
- [x] Team Icebreaker: 40 prompts, isPremium: true
- [x] Road Trip: 35 prompts, isPremium: true
- [x] Dinner Party: 35 prompts, isPremium: true
- [x] Old Friends: 40 prompts, isPremium: true
- [x] All prompts have LIGHT/MEDIUM/DEEP depth levels

### Auth
- [x] NextAuth v5 with Credentials provider (email + password)
- [x] bcryptjs password hashing
- [x] JWT session strategy
- [x] /api/register route (email + password account creation)
- [x] /login page with register toggle
- [x] Anonymous users can access free pack without auth

### Core UI Components
- [x] `<PromptCard>` — full-screen card, swipe gesture, keyboard (ArrowRight/Space), click, depth badge, position indicator, CSS translateX transition
- [x] `<UpgradeModal>` — shadcn Dialog, pack list with checkmarks, $9.99 + $24.99 CTAs, Stripe checkout redirect
- [x] `<FreeCardPreview>` — interactive 10-card preview for SEO pages, dot navigation
- [x] `<StickyUpgradeBar>` — fixed bottom bar with unlock CTA
- [x] `<PostHogProvider>` — lazy PostHog init, pageview tracking

### Pack Player
- [x] `/packs/[slug]` — client component, fetch pack+prompts from API
- [x] LocalStorage position persistence (`prompt_pos_${pack.id}`)
- [x] Premium gating at card 10 for non-purchasers
- [x] UpgradeModal triggered when hitting gate
- [x] "Start Together" button → creates room → redirects to /room/[code]
- [x] End-of-deck state with restart option

### Packs Page
- [x] `/packs` — lists all 6 packs with descriptions, card counts, free/premium badges

### API Routes
- [x] `GET /api/packs/[slug]/prompts` — returns pack + all prompts
- [x] `GET /api/user/purchase` — returns { hasPurchase: bool } for current user
- [x] `POST /api/checkout` — creates Stripe Checkout session (lazy init, guard for missing key)
- [x] `POST /api/webhooks/stripe` — verifies signature, writes Purchase, sends Resend email
- [x] `POST /api/rooms` — creates room with 6-char code
- [x] `GET /api/rooms/[code]` — returns room state
- [x] `PATCH /api/rooms/[code]` — increments currentCardIndex
- [x] `POST /api/register` — creates user with bcrypt password

### Co-use Room
- [x] `/room/[code]` — client component, 2-second polling, PromptCard display
- [x] "Next Card" button fires PATCH
- [x] "Invite Partner" copies URL to clipboard
- [x] Shows current card synced across users

### PWA / Offline
- [x] `public/manifest.json` — name, short_name, display: standalone, start_url: /app, theme_color
- [x] PWA icons: icon-192.png, icon-512.png
- [x] manifest link in layout.tsx head
- [x] apple-mobile-web-app meta tags
- [x] `/app` route — PWA entry point

### SEO Landing Pages (all with generateMetadata, FreeCardPreview, StickyUpgradeBar)
- [x] `/deep-questions` — Deep Conversation Questions for Close Friends
- [x] `/first-date` — First Date Questions That Actually Work
- [x] `/couples` — Conversation Starters for Couples
- [x] `/work-meetings` — Icebreaker Questions for Work Meetings
- [x] `/road-trip` — Road Trip Conversation Starters
- [x] `/dinner-party` — Dinner Party Icebreakers for Adults
- [x] `/offline` — Party Game App That Works Without WiFi
- [x] `/card-game` — Digital Conversation Card Game App
- [x] `/family` — Family Dinner Table Questions
- [x] `/remote-team` — Virtual Icebreaker Questions for Remote Teams

### Marketing / Home Page
- [x] `/` — hero, features grid (6 contexts / offline / no subscription), pack grid, footer with SEO links
- [x] ISR revalidate: 3600

### SEO Infrastructure
- [x] `src/app/sitemap.ts` — all pages with lastModified and changeFrequency
- [x] `src/app/robots.ts` — allow all, disallow /api/, noindex room pages

### Deployment / Docker
- [x] `Dockerfile` — node:20-slim, openssl in builder+runner, prisma generate in builder, db push + seed in CMD
- [x] `output: "standalone"` confirmed in next.config.ts
- [x] Zero-config startup (app runs without any env vars configured)

### Build Verification
- [x] `npm run build` passes — 24 routes, 0 TypeScript errors
- [x] Dev server starts and responds on port 3000
- [x] Pack API returns 50 prompts for first-date
- [x] Room API creates and retrieves rooms
- [x] Sitemap.xml returns all URLs
