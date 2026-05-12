# HUMAN_INPUT_NEEDED.md

The app runs fully without any of these credentials. They are needed only to enable specific optional features.

---

## 1. Stripe (Payments) — Optional

**Required for**: Processing actual purchases ($9.99 lifetime / $24.99 facilitator).

Without credentials: The upgrade modal appears and the checkout button shows, but clicking it returns a "Payments are not configured" message instead of redirecting to Stripe. The app is otherwise fully functional.

**Steps to configure:**
1. Create a Stripe account at https://stripe.com
2. Create two products in the Stripe Dashboard:
   - "Prompt Lifetime Unlock" — one-time price: $9.99
   - "Prompt Facilitator Pack" — one-time price: $24.99
3. Copy the price IDs (start with `price_...`)
4. Get your API keys from Dashboard → Developers → API keys
5. For webhooks: Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`

**Add to `.env.local` (or Coolify environment variables):**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_LIFETIME_PRICE_ID=price_...
STRIPE_FACILITATOR_PRICE_ID=price_...
```

---

## 2. Resend (Email) — Optional

**Required for**: Sending purchase confirmation emails after checkout.

Without credentials: Purchases still get recorded in the database. No confirmation email is sent; the failure is silently logged.

**Steps to configure:**
1. Create a Resend account at https://resend.com
2. Add and verify your sending domain
3. Create an API key

**Add to `.env.local`:**
```
RESEND_API_KEY=re_...
EMAIL_FROM=Prompt <noreply@yourdomain.com>
```

---

## 3. PostHog (Analytics) — Optional

**Required for**: Session recording and funnel analytics (upgrade modal → checkout → purchase).

Without credentials: The app works normally. No analytics events are tracked.

**Steps to configure:**
1. Create a PostHog account at https://posthog.com
2. Create a project and get the project API key

**Add to `.env.local`:**
```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 4. AUTH_SECRET — Required for Production

**Required for**: Secure NextAuth JWT session signing.

A default placeholder secret is baked into the Dockerfile for zero-config deployment, but you **must** override this in production to prevent session forgery.

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

**Add to production environment:**
```
AUTH_SECRET=<generated-value>
NEXTAUTH_URL=https://yourdomain.com
```

---

## 5. DATABASE_URL — Required for Persistent Data

The Dockerfile defaults to `file:/data/app.db` (a volume path inside the container).

For Coolify: Mount a persistent volume at `/data` so the SQLite database survives container restarts.

For local dev: `DATABASE_URL="file:./dev.db"` in `.env.local` (already set).
