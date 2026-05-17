# Shopify App Portfolio — Strategy & Build Plan

_Living document. Updated as decisions are made. Start date: May 2026._

---

## Origin — The Katie Keith model

The inspiration: **Katie Keith** of [Barn2 Plugins](https://barn2.com) — a portfolio of ~20 small, focused WordPress/WooCommerce plugins generating ~$150K/month (~$1.7–1.8M/year), ~17,000 active subscription customers, used on 90,000+ sites.

The model isn't about AI automation agencies or freelance client work — it's a **compounding portfolio of micro-products** aimed at one overlapping customer, grown via organic SEO and cross-selling. Key mechanics:

- Start from real demand (forums, 1★ app reviews, feature requests), not brainstorming
- Ship ONE product, validate, then repeat — never scatter
- Target the same customer with every product so cross-selling is structural
- Dominate problem-shaped keywords with honest tutorials that naturally lead to the app
- Revenue = recurring subscriptions, not one-off fees

**Katie's Rule #1:** _"Stay in a domain you already understand. If you build WordPress sites, build WordPress plugins."_

---

## Key decisions made

| Decision | Choice | Why |
|---|---|---|
| Model | Micro-product portfolio, NOT freelance agency | Compounding, async sales, no cold outreach |
| Ecosystem | **Shopify apps** | Real marketplace (4.7M+ merchants), built-in billing, 0% rev share on first $1M lifetime, React skills transfer |
| Customer | **E-commerce merchants** | Pays well, large TAM, active app-install culture |
| Timeline | Long game (years, not months) | Year 1 = one product + first paying customers. Portfolio + $5K/mo MRR = years 2–4 |
| Budget | ~$15–50/mo actual cost (well inside $100–300 budget) | Hosting + DB + LLM API; the real cost is time (~10–15 hrs/week) |
| First app category | **Estimated Delivery Date (EDD) display** | See teardown below |
| Ruled out | Size charts (priced to $3.99/mo ceiling), AAA agency model, WordPress plugins, standalone micro-SaaS (no marketplace) | See reasoning below |

---

## Year-1 roadmap

### Phase 0 — Become a merchant (Weeks 1–6)

**Goal:** acquire the domain context Katie's Rule #1 demands. Currently zero e-commerce exposure in the portfolio.

- Create free Shopify Partner account + development store at [partners.shopify.com](https://partners.shopify.com)
- Set up a realistic dev store: add products, configure shipping, install 8–10 apps, run the daily merchant workflow
- Live in: r/shopify, Shopify Community forums, merchant Facebook groups
- Read 1★ and 3★ reviews of EDD apps — build a spreadsheet of recurring complaints and "I wish it did X"
- **Output:** 20–40 observed merchant pains, a validated wedge, the spreadsheet that becomes the v1 spec

### Phase 1 — Pick & validate ONE idea (Weeks 6–12)

**Goal:** validate the EDD category and sub-niche before writing code.

- Apply the filters: largest reachable audience + clear marketing keyword + buildable solo + underserved + companion-app potential
- Competitor analysis: map top 8–10 EDD apps (ratings, installs, pricing, review themes)
- Validate before code: interview 5–10 merchants via forums/Reddit/cold DM
- Low-fi mock in Figma (Polaris-style), show to merchants
- Define v1 scope: minimum that solves the core pain
- Set pricing (free plan + paid tier)

### Phase 2 — Build the MVP (Weeks 12–26)

**Goal:** working app on a dev store.

- Scaffold, date engine, admin config, theme extension, billing — see architecture section
- Core feature only. Resist all scope creep.
- Test on dev store end-to-end: install, configure, see widget on storefront, billing, uninstall

### Phase 3 — Submit & launch (Weeks 26–32)

**Goal:** live in the Shopify App Store.

- Write the App Store listing (listing copy = SEO too)
- Submit for review: 5–10 business days, automated + manual Shopify review
- Expect one rejection round (usually Polaris compliance or missing GDPR webhooks) — fix fast and resubmit
- Launch; get first installs; turn on the content engine

### Phase 4 — SEO engine + first customers (Weeks 32–52)

**Goal:** Katie's actual growth channel running.

- Build a blog (Next.js content site — exactly your current skillset)
- Write "how to [exact problem]" tutorials targeting the keyword map below
- Engage the communities from Phase 0 — answer "is there an app for X?" questions
- Iterate from support tickets: recurring feature requests → future separate apps (not feature bloat)
- **Year-1 success:** app live, first ~10–50 paying merchants, validated problem, content engine started. Revenue ~$0–a few hundred/mo MRR. That is on track.

---

## The category — Estimated Delivery Date (EDD)

### Why EDD beat size charts

Size charts were ruled out on one criterion: **$3.99/mo pricing ceiling.** The entire category has trained merchants to expect it near-free. EDD display runs $4–10/mo and the scheduling/picker end runs $15–40/mo (Zapiet: 1,700+ reviews at $14.99+). EDD also applies to every store; size charts are apparel-only.

### Two sub-categories (don't confuse them)

| Sub-type | What it does | Complexity | Price range |
|---|---|---|---|
| **Display (v1 target)** | Passively shows "Get it by Tue, May 26" on product/cart pages | Low — theme app extension | $0–10/mo |
| **Picker / scheduler** | Customer selects a delivery date at checkout (florists, bakeries, local delivery) | High — complex zones/schedules | $10–40/mo |

**Recommendation:** build the EDD display as v1 (theme extension, every store is a prospect, minimal backend), architected so v2 can bolt on the picker/scheduler for local-delivery verticals — that's where pricing jumps to $15–40 and real stickiness lives.

### Competitor landscape (EDD display sub-category)

| App | Price | Reviews | Signal |
|---|---|---|---|
| WowETA | from $4.99/mo | — | Cheap, feature-rich, tutorial-producing (self-serving SEO) |
| Kaktus EDD | Free–$9.99/mo | — | Heavy free tier, limited config |
| ArrivesBy | Free | — | Very simple, no config depth |
| C-EDD | Free–$7.99/mo | — | Basic |
| Omega / S: EDD ETA | Free–$9.99/mo | — | Mid-tier, some polish |
| EDDer | Free–$9.99/mo | — | Average UX |
| Delivery Timer | — | — | Countdown variant + EDD |
| LEVEL 2 EDD | $5–$19/mo | — | More rules, higher price, complex UI |
| **Zapiet** | from $14.99/mo | 1,700+ ★4.9 | Owns the picker niche — do not attack directly in v1 |
| **Flare** | from $39/mo | — | High-end rules engine |

Key observation: **the display sub-category is not locked by a single giant.** Many small players with low review counts = room to enter and own a position.

### The wedge (from 1★ / 3★ review research)

Recurring complaints across the category:

1. **Inaccurate date math** — the #1 complaint. Apps miscalculate, show wrong dates, cause customer disputes. Root cause: naive "add N days" logic that ignores cutoffs, weekends, holidays.
2. **Can't handle real-world complexity** — one global lead time doesn't work when products ship from different warehouses with different processing times, or when some collections have 2-day handling and others have 7-day.
3. **Breaks on timezone edge cases** — merchant in EST, orders from EU, widget shows wrong date.
4. **Reliability horror stories** — "app stopped working mid-marketing push, no support reply." Uptime is table stakes but failing apps prove it's still differentiable.
5. **Doesn't scale** — "not suitable for stores with thousands of products."
6. **Conflicts with Shopify's native Shop Promise** — merchants confused when both fire.

**Your wedge:** an EDD app whose date engine is *genuinely correct* — business days, country-specific holidays, per-product/collection lead times, timezone-safe, cutoff-time aware. Not a design play; a **correctness and reliability** play. The widget can be polished too (your front-end edge), but the moat is the date math.

---

## SEO keyword map

### How the Katie playbook works here

Write "how to [exact problem]" tutorials that rank on Google and naturally funnel to the app. Articles aren't generic SEO fluff — they're honest solutions to the exact pain the app solves. One article = one search problem solved = one funnel into the app.

---

### Bucket 1 — App Store listing (buy intent, compete in the listing itself)

These are the terms your app's title, subtitle, and listing description must hit. Shopify App Store has its own search algorithm — keywords in the app name and listing copy matter.

| Keyword | Competition | Priority |
|---|---|---|
| estimated delivery date shopify | Hard — many apps target this directly | Must have in listing |
| shopify delivery date app | Hard | Must have |
| shopify get it by date | Medium — fewer apps own this phrasing | Own it |
| shopify show estimated arrival | Medium | Include |
| shopify ETA product page | Medium | Include |
| shopify shipping time display | Medium | Include |

---

### Bucket 2 — Tutorial / how-to content (informational → converts)

These drive organic blog traffic. Note: WowApps, Essential Apps, BSS Commerce, Identixweb, and Setubridge already publish tutorials on the top terms — they're self-serving (written to rank and funnel to their own apps). Your tutorials should be genuinely better: honest, technically accurate, show all methods (including manual code), not just "install our app."

| Keyword | Competition | Content angle |
|---|---|---|
| how to add estimated delivery date shopify | Hard — heavily targeted by existing apps | Write the definitive guide: all 4 methods (native Shopify, custom Liquid, metafields, app). Be honest. |
| how to show delivery date on shopify product page | Hard | Same — compete on depth and honesty |
| how to display estimated arrival date shopify | Medium — less targeted phrasing | Good entry point |
| how to add get it by date shopify | Medium | Own this phrasing — competitors miss it |
| how to show business days to ship on shopify | Low — specific | Easy win, converts well |
| how to set cutoff time for delivery shopify | Low | Very specific, maps to your date engine's feature |

---

### Bucket 3 — Problem-aware content (the merchant doesn't know the solution yet)

These merchants are typing their frustration, not the solution. Highest-quality funnel when you can answer the frustration and reveal the fix.

| Keyword | Competition | Content angle |
|---|---|---|
| shopify customers asking when will order arrive | Very low | "How to stop your Shopify customers emailing about delivery dates" — pure problem-aware, ends with the app |
| reduce where is my order emails shopify | Low | Same article angle — WISMO (Where Is My Order) is an industry term |
| shopify wismo emails | Low-Medium — growing term | "What are WISMO emails and how Shopify stores kill them" |
| shopify reduce shipping support tickets | Low | Broader catch-all, funnels well |

---

### Bucket 4 — Long-tail gems (low competition, high purchase intent)

These are exactly the pains that existing apps fail at — your wedge in copy form. Anyone searching these has already tried generic EDD apps and hit the wall.

| Keyword | Competition | Why it converts |
|---|---|---|
| shopify estimated delivery date per product | Low | The #1 config pain. Your differentiator. |
| shopify delivery date per collection | Very low | Specific, underserved, easy to rank |
| shopify cutoff time estimated delivery | Very low | Maps to your date engine feature |
| shopify delivery date different countries | Low | Per-country config = Pro plan feature |
| shopify estimated delivery date timezone | Very low | The timezone bug that 1★ reviews complain about |
| shopify show different delivery time by vendor | Very low | Multi-vendor stores, specific pain |
| shopify delivery date not accurate | Low-medium | Problem-aware, mid-funnel — they've been burned |
| shopify estimated delivery date holiday | Low | Holiday calendar = your differentiator |

---

### Bucket 5 — Competitor attack (people evaluating alternatives)

Write these once you have real reviews and installs. Not priority for v1.

| Keyword | Competition | Notes |
|---|---|---|
| ArrivesBy alternative shopify | Low | ArrivesBy is free-only, no per-product config |
| Omega estimated delivery date alternative | Low | Omega has UX complaints |
| best estimated delivery date app shopify 2026 | Medium | Classic comparison article — write after you have 10+ reviews |
| kaktus estimated delivery date review | Low | Review teardown, comparison |

---

### Content launch order (what to write first)

Write these in this sequence — each builds on the last and links internally:

1. **"How to stop your Shopify customers emailing about delivery dates"** — problem-aware, no prior keyword knowledge needed, broad top of funnel. Ends with the app.
2. **"How to show a different estimated delivery date for each product in Shopify"** — your wedge as a tutorial. Covers the specific pain. Hard to write without the app existing, so write after v1 ships.
3. **"How to add estimated delivery date to your Shopify product page (all 4 methods)"** — the definitive how-to guide targeting the hardest keyword. Compete on depth. Links to #1 and #2.
4. **"Why your Shopify estimated delivery date is wrong (and how to fix it)"** — the accuracy/timezone problem. Maps directly to your date engine's value.
5. **"Best estimated delivery date apps for Shopify in 2026"** — comparison article. Write once you have reviews.

---

## v1 Technical architecture

### Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Remix** (Shopify's official template) | SSR, Shopify CLI integration, App Bridge baked in |
| UI (admin) | **Polaris** | Required for App Store review |
| Auth | **OAuth** (handled by Remix template) | `authenticate.admin(request)` on every protected route |
| DB | **Prisma + SQLite** (dev) → **Postgres** (prod) | Switch provider string; schema is identical |
| API | **Shopify GraphQL Admin API** | REST is deprecated |
| Storefront | **Theme App Extension** | Required for new apps; Liquid block + vanilla JS + CSS, CDN-hosted |
| Billing | **Shopify Billing API** | Charges appear on merchant's Shopify invoice — no Stripe needed |
| Hosting | **Fly.io** or **Render** | Persistent server for webhooks; ~$5–10/mo |
| Testing | **Jest** for the date engine (isolated pure TS) | Test the date math thoroughly before building UI |

---

### Project structure

```
edd-app/
├── app/
│   ├── routes/
│   │   ├── app.jsx                  ← layout: App Bridge auth wrapper
│   │   ├── app._index.jsx           ← dashboard / quick stats
│   │   ├── app.settings.jsx         ← global config (cutoff, timezone, lead days, holidays, templates)
│   │   ├── app.products.jsx         ← per-product / per-collection overrides (Pro plan)
│   │   ├── app.billing.jsx          ← plan selection / upgrade
│   │   └── webhooks.jsx             ← GDPR + app/uninstalled handlers
│   ├── lib/
│   │   └── dateEngine.ts            ← pure TS, no Shopify dependencies — the core IP
│   ├── components/
│   │   └── EddPreview.jsx           ← Polaris preview card in settings
│   └── shopify.server.js            ← app config (scopes, billing plans)
├── extensions/
│   ├── edd-theme-widget/            ← Theme App Extension (product page + cart)
│   │   ├── blocks/
│   │   │   └── edd-display.liquid
│   │   ├── assets/
│   │   │   ├── edd.js               ← client-side date calc (mirrors dateEngine.ts in vanilla JS)
│   │   │   └── edd.css
│   │   └── shopify.extension.toml
│   └── edd-checkout/                ← Checkout Extension (separate build, separate review)
│       ├── src/
│       │   └── EddCheckout.tsx      ← React component using Shopify Checkout UI Kit
│       ├── package.json
│       └── shopify.extension.toml
├── prisma/
│   └── schema.prisma
└── shopify.app.toml
```

---

### The date engine — `lib/dateEngine.ts`

This is the **core IP** of the app. The correctness of this module is the wedge. It's a pure TypeScript function with zero Shopify dependencies — easy to unit-test exhaustively.

```typescript
export interface EddConfig {
  timezone: string;          // IANA tz — "America/New_York", "Europe/London"
  cutoffTime: string;        // "14:00" — orders after this ship next business day
  leadDays: number;          // default processing + transit days
  businessDays: number[];    // [1,2,3,4,5] = Mon–Fri. [1,2,3,4,5,6] = Mon–Sat
  blackoutDates?: string[];  // ["2026-12-25"] — custom closures
}

export function calculateEDD(
  orderTime: Date,           // UTC timestamp of order
  config: EddConfig,
  holidays: Date[]           // pre-loaded country holiday dates
): Date {
  // 1. Convert orderTime to merchant's timezone
  // 2. If past cutoffTime, advance to next business day start
  // 3. Add leadDays, skipping: weekends (per businessDays), holidays, blackoutDates
  // 4. Return resulting date (in merchant timezone, then back to UTC)
}

export function formatEDD(date: Date, template: string, timezone: string): string {
  // Template tokens: {weekday}, {month}, {day}, {date}
  // e.g. "Get it by {weekday}, {month} {day}" → "Get it by Tuesday, May 26"
  // Renders in merchant's timezone
}
```

**Critical test cases to write before anything else:**
- Order at 1:59pm EST — same-day start
- Order at 2:01pm EST — next business day start
- Order on Friday at 3pm — next start = Monday
- Order on Friday before cutoff, 3 lead days — lands on Wednesday
- Order day before a holiday — holiday skipped, +1 day
- Order in UTC+5 timezone with a US holiday calendar — no cross-contamination
- 5-day lead time spanning a US holiday week (Thanksgiving block)

**Companion file: `assets/edd.js`**
A mirror of the calculation logic in vanilla ES6 (no Node APIs). Ships in the theme extension and runs client-side, reading merchant config from data attributes baked into the Liquid block.

```javascript
// edd.js — runs in the browser
// reads: data-timezone, data-cutoff, data-lead-days, data-business-days,
//        data-holidays (JSON), data-blackout-dates (JSON), data-template
// writes: the formatted EDD string into the widget span
```

This means **zero AJAX for v1** — merchant config is baked into the page at render time via Shopify metafields. Faster, simpler, no network dependency.

---

### Checkout extension — `extensions/edd-checkout/src/EddCheckout.tsx`

A separate React extension using Shopify's Checkout UI Kit — not Polaris, not arbitrary HTML. The checkout sandbox is strict: no external scripts, only approved UI components, no `document`/`window`.

```tsx
import {
  Banner,
  Text,
  useAppMetafields,
  useCartLines,
} from '@shopify/ui-extensions-react/checkout';
import { calculateEDD, formatEDD } from './dateEngine'; // same logic, bundled in

export function EddCheckout() {
  // Read merchant config from shop metafield (declared in shopify.extension.toml)
  const [configMeta] = useAppMetafields({ type: 'shop', namespace: 'edd_app', key: 'config' });
  const lines = useCartLines();

  if (!configMeta?.value) return null;

  const config = JSON.parse(configMeta.value);

  // Use the longest lead time across all cart lines (conservative, avoids disappointment)
  const maxLeadDays = Math.max(...lines.map(l =>
    l.merchandise.product?.metafield?.value
      ? parseInt(l.merchandise.product.metafield.value)
      : config.leadDays
  ));

  const edd = calculateEDD(new Date(), { ...config, leadDays: maxLeadDays }, config.holidays);
  const display = formatEDD(edd, config.messageTemplate, config.timezone);

  return <Text>{display}</Text>;
}
```

**Key details:**
- `useAppMetafields()` reads metafields declared in `shopify.extension.toml` — zero network latency, runs client-side in the checkout sandbox
- Uses the same `dateEngine` logic bundled directly into the extension (not fetched from the app server)
- Cart-aware: takes the max lead time across all items so the EDD covers the slowest item
- Per-product metafield (`merchandise.product.metafield`) requires the `metafield` field declared in the extension's target config
- Goes through its **own App Store review** separate from the theme extension — plan for this in the timeline

**`shopify.extension.toml` for the checkout extension:**
```toml
[[extensions]]
name = "EDD Checkout Display"
handle = "edd-checkout"
type = "ui_extension"

[[extensions.targeting]]
module = "./src/EddCheckout.tsx"
target = "purchase.checkout.delivery-address.render-after"

[extensions.metafields]
  [[extensions.metafields.namespaces]]
  namespace = "edd_app"
  key = "config"
  type = "shop"

  [[extensions.metafields.namespaces]]
  namespace = "edd_app"
  key = "lead_days"
  type = "product"
```

---

### Message template — presets + editable

Admin UI pattern: dropdown of preset phrasings (starting point) + editable text field below it, with a token reference. Prevents blank/broken output while giving full control.

**Preset options:**
```
"Get it by {weekday}, {month} {day}"    ← default
"Arrives by {weekday}"
"Estimated delivery: {date}"
"Ships within {lead_days} business days"
"Order now — arrives {weekday}, {month} {day}"
```

**Token reference shown below the input:**
`{weekday}` → Tuesday · `{month}` → May · `{day}` → 26 · `{date}` → May 26, 2026 · `{lead_days}` → 3

The live preview card in settings updates in real-time as the merchant edits the template.

---

### Theme extension — `blocks/edd-display.liquid`

```liquid
{% comment %} EDD Display Block — rendered on product page {% endcomment %}

{% assign config = shop.metafields.edd_app.config | parse_json %}

<div
  class="edd-widget"
  data-timezone="{{ config.timezone }}"
  data-cutoff="{{ config.cutoff_time }}"
  data-lead-days="{{ product.metafields.edd_app.lead_days | default: config.lead_days }}"
  data-business-days="{{ config.business_days }}"
  data-holidays="{{ config.holidays_json }}"
  data-blackout="{{ config.blackout_dates }}"
  data-template="{{ config.message_template }}"
>
  <span class="edd-widget__text">Calculating delivery...</span>
</div>

{{ 'edd.js' | asset_url | script_tag }}
{{ 'edd.css' | asset_url | stylesheet_tag }}
```

**Block schema settings** (configurable in Shopify theme editor):
- Show/hide the widget
- Position (above/below add-to-cart)
- Icon style (truck / calendar / none)

**Key details:**
- Per-product lead-day override lives in `product.metafields.edd_app.lead_days` — set via the app's admin products page using the Admin GraphQL metafield mutation
- Shop-level config lives in `shop.metafields.edd_app.config` — updated whenever the merchant saves settings
- CDN-hosted by Shopify (no CORS, no latency, global)

---

### Admin config UI — `routes/app.settings.jsx`

Built entirely with Polaris components (required for review). Key fields:

```
┌─ Global Settings ─────────────────────────────────────────┐
│  Timezone              [America/New_York ▼]                │
│  Order cutoff time     [14 : 00]  (orders after ship next day) │
│  Default lead days     [3] business days                   │
│  Business days         [✓Mon ✓Tue ✓Wed ✓Thu ✓Fri ☐Sat ☐Sun] │
│  Holiday calendar      [United States ▼]                   │
│  Custom blackout dates [+ Add date]                        │
│  Message template      ["Get it by {weekday}, {month} {day}" ▼] │
└───────────────────────────────────────────────────────────┘

┌─ Live Preview ────────────────────────────────────────────┐
│  Order placed: [now]    →   Get it by Tuesday, May 26     │
│  Order placed: [2pm+1min] → Get it by Wednesday, May 27   │
└───────────────────────────────────────────────────────────┘
```

---

### Data model — `prisma/schema.prisma`

```prisma
model Session {
  id          String    @id
  shop        String
  state       String
  isOnline    Boolean   @default(false)
  scope       String?
  expires     DateTime?
  accessToken String
  userId      BigInt?
}

model ShopConfig {
  id               String   @id @default(cuid())
  shop             String   @unique
  timezone         String   @default("America/New_York")
  cutoffTime       String   @default("14:00")
  leadDays         Int      @default(3)
  businessDays     String   @default("1,2,3,4,5")
  holidayCountry   String   @default("US")
  blackoutDates    String   @default("[]")    // JSON array of "YYYY-MM-DD"
  messageTemplate  String   @default("Get it by {weekday}, {month} {day}")
  plan             String   @default("free")
  installedAt      DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model ProductOverride {
  id          String @id @default(cuid())
  shop        String
  resourceId  String  // productId or collectionId
  resourceType String // "product" | "collection"
  leadDays    Int
  @@unique([shop, resourceId])
}
```

---

### Billing plans

| Plan | Price | Features |
|---|---|---|
| **Free** | $0 | Global config, US holidays, standard message templates, product page display |
| **Pro** | $6.99/mo (TBD) | + Per-product and per-collection lead times, all country holiday calendars, custom message template string, cart + checkout display, priority support |

Wired via the Shopify Billing API (`shopify.api.billing.check()` / `.request()`). Plan stored in `ShopConfig.plan`. Feature flags read from plan at runtime.

---

### Mandatory webhooks (GDPR + lifecycle)

Shopify App Store review **will reject** apps missing these:

| Webhook | Handler |
|---|---|
| `app/uninstalled` | Delete `ShopConfig` + all `ProductOverride` rows for the shop |
| `customers/data_request` | Respond: app stores no customer PII |
| `customers/redact` | No-op (no customer data stored) |
| `shop/redact` | Delete all shop data (same as uninstalled) |

---

### Build sequence

Do these in order — each step validates the next:

1. `npm create @shopify/app@latest -- --template remix` — scaffold everything
2. Switch Prisma provider to Postgres; add `ShopConfig` + `ProductOverride` models
3. **Write `dateEngine.ts` + Jest tests** — do this before any UI. The tests will catch edge cases that would otherwise surface as 1★ reviews.
4. Write the client-side `edd.js` mirror; verify it matches `dateEngine.ts` outputs on the same test cases
5. Build admin settings page (Polaris form → saves to `ShopConfig` → pushes to shop metafield)
6. Build the theme extension block (Liquid + JS reads metafield config)
7. Build per-product override page (products table → set lead days → write to product metafield)
8. Wire Billing API (free vs Pro plan gating)
9. Add all 4 GDPR webhooks + app/uninstalled
10. End-to-end test on dev store: install → configure → view widget on storefront → upgrade plan → uninstall
11. Deploy to Fly.io
12. Submit to App Store (listing copy, screenshots, icon)

---

## Parallel thread — Llamas Cookbook (iOS App Store)

**Status: very close to App Store release.**

This is the Katie model on a second platform simultaneously. The Cookbook is a polished SwiftUI/SwiftData recipe iOS app (iOS 18, offline-first, multi-timer cook mode, per-customer accent color theming with ripple cascade). The engineering quality is well above average indie iOS work.

**Why this matters strategically:**
- Releasing the Cookbook gives you your first recurring-revenue product — before the Shopify app is even built. First live proof of the portfolio model.
- App Store + StoreKit subscriptions work exactly like Shopify billing — same flywheel, different platform.
- Two products from the start (iOS Cookbook + Shopify EDD) aimed at completely different customers — but that's OK for now. They don't need to cross-sell; they prove the capability and generate early learnings.
- The color picker handoff doc already shows the level of system design on the iOS side — that engineering will raise the quality bar on everything you build.

**Cookbook decisions confirmed:**

| Decision | Choice |
|---|---|
| Pricing | Freemium + subscription |
| Remaining blockers | Final polish + App Store metadata (screenshots, description, preview) |
| Growth channels | ASO ("recipe app", "cook mode") + short-form video (TikTok/Reels) + open to content site |

**Freemium split** — TBD (see open questions). The color picker handoff doc already has the answer baked in: the accent theming is auth-gated ("unsigned users see a locked card"). That's the template — gated features are premium. Typical split for a cook-mode app:

| Free tier | Subscription (Pro) |
|---|---|
| Unlimited manual recipe entry | **AI photo import** — photograph any cookbook/card/screenshot → Claude Sonnet parses into structured ingredients + steps |
| Cook mode (basic) | iCloud sync / backup |
| Basic themes | Accent color picker + theme variants |
| — | Multi-timer cook mode, Live Activities |

**The AI photo import is the killer feature.** "Photograph any cookbook page → structured recipe in 5 seconds" is:
- A clear, demonstrable value proposition (visible in a 10-second Reel)
- Something no rival recipe app does as a first-class feature
- A genuine reason to pay — saves 15 minutes of manual typing per recipe
- Uses **Claude Sonnet** via the Anthropic API (vision + structured output)

Cost note: Sonnet API calls for a single photo parse are cheap (~1-3 cents/parse). At typical usage, the API cost per subscriber is well below subscription revenue. Watch for prompt caching opportunities to reduce cost further — the `claude-api` skill in this session can help optimize that if needed.

**Growth note:** ASO is different from Google SEO. Key ASO levers: app name (keyword-first, e.g. "Llamas Cookbook: Cook Mode & Timer"), subtitle (secondary keywords), keyword field (hidden, 100 chars), first 3 lines of description (above the fold), screenshots (the primary conversion driver). Short-form video (Reels/TikTok showing the cook mode in action + the ripple color cascade) could generate organic installs faster than ASO alone in the early days.

**Content site angle:** a recipe blog that ranks for "[recipe name] easy weeknight" → drives App Store installs at the bottom. The Katie SEO model applied to iOS. This is a longer play but compounds well. Worth building once the app has traction.

**Open Cookbook questions** — see open questions section below.

---

## Phase 0 — Week 1 checklist (start this week)

Zero cost. Zero code. Pure merchant immersion.

### Day 1–2: Set up your merchant environment

- [ ] Create a free **Shopify Partner account** at [partners.shopify.com](https://partners.shopify.com)
- [ ] Create a **development store** (free, unlimited, no expiry) — name it something like `lorenzo-edd-test`
- [ ] Add 10–15 products across 2–3 collections (use placeholder images, realistic product names and prices)
- [ ] Set up: shipping zones, shipping rates, order processing time — go through every setting in the Shipping & Delivery section
- [ ] Install 6–8 real apps to feel the merchant install/configure loop:
  - One EDD app (e.g. Omega EDD, ArrivesBy, or Kaktus)
  - One reviews app (Judge.me — free)
  - One email app (Klaviyo free tier)
  - One page builder (PageFly free)
  - One upsell/bundle app
  - One utility (your choice)

### Day 3–4: The 1★ review research sprint

This is the most important Phase 0 work. Build a spreadsheet.

**Spreadsheet columns:** App name | Review rating | Complaint category | Exact quote | Actionable? (Y/N)

**Apps to review-mine (EDD category):**
1. Omega / S: Estimated Delivery Date ETA
2. ArrivesBy
3. Kaktus Estimated Delivery Date
4. C-EDD: Estimated Delivery Date Plus
5. WowETA
6. EDDer
7. LEVEL 2 EDD

**For each app:** sort reviews by "Most Recent", filter to 1–3 stars, read every one. Look for:
- Recurring complaint (mentioned 3+ times = real pain)
- Phrases merchants use to describe the problem (these become your SEO keywords)
- Features they're asking for that don't exist yet
- Support quality complaints

### Day 5–7: Community listening

- [ ] Join **r/shopify** — sort by Hot, then New. Read every post about shipping, delivery dates, customer expectations. Note what merchants say naturally.
- [ ] Join **Shopify Community forums** (community.shopify.com) — search "estimated delivery date", "delivery time", "shipping time display". Read threads.
- [ ] Search Facebook groups: "Shopify Entrepreneurs", "Shopify Dropshipping" — listen for delivery-date frustrations.
- [ ] Optional: post in r/shopify as a merchant ("How do you handle customer questions about delivery dates?") — you'll get 10–20 honest replies.

### Output by end of Week 1

A spreadsheet with 30–50 real merchant complaints, categorized. This becomes your v1 spec and your first 3 SEO article topics. Share it here and we'll narrow the wedge together.

---

## The color picker tangent

A technical handoff doc (`c3450c25-colorpickerhandoff.md`) covers an iOS accent color picker built for the **Llamas Cookbook** app — deferred-commit pattern, ripple cascade, UIKit sync, CloudKit mirror. It already maps the iOS concepts to web/Shopify equivalents.

**Verdict:** the feature itself (per-customer color personalization for a Shopify store) is too niche for a first app — doesn't solve a "merchants losing money" pain. But:
- The **deferred-commit pattern** (`write only on close, not on every drag tick`) maps directly to the admin settings UI — use it when building the live preview in the settings page
- The **ripple cascade** technique is reusable polish for any admin UI you build
- The **Llamas Cookbook iOS app** may be worth productizing separately as a paid iOS app — the engineering on it is clearly polished and above average. Separate thread, same Katie model, different platform (App Store + StoreKit)

---

## Decisions log

| Decision | Choice | Date |
|---|---|---|
| App name | TBD — decide after Phase 0 immersion | May 2026 |
| Free plan scope | Global config free; per-product/collection lead times = Pro only | May 2026 |
| V1 holiday calendar | US only | May 2026 |
| V1 display locations | Product page + cart + **checkout extension** (see note) — email pushed to v2 | May 2026 |
| Checkout extension | Yes, include in v1 — highest conversion-impact location | May 2026 |
| Message templates | Presets dropdown + editable string (tokens: `{weekday}`, `{month}`, `{day}`, `{date}`) | May 2026 |
| App #2 direction | TBD — let Phase 0 research surface it | May 2026 |

### Note on "everywhere including checkout"

Checkout display is the highest-value location (most abandonment reduction) but requires a **separate Checkout Extension** — a React component using Shopify's Checkout UI Kit, distinct from the theme app extension used for product/cart pages. Two implementation paths:

| Location | Extension type | Complexity |
|---|---|---|
| Product page | Theme app extension (Liquid block + JS) | Low |
| Cart page | Theme app extension (same block, cart template) | Low — same extension |
| **Checkout** | **Checkout Extension (React, separate build)** | **Moderate — separate extension, separate review** |
| Order confirmation email | Shopify email template injection (no extension type) | High — merchant must edit email templates; not clean |

**Recommended v1 scope:** product page + cart (same extension, ships together) + checkout extension (separate, but high priority given the goal). Order confirmation email: push to v2 — the mechanism is clunky and lowers the quality bar.

---

## Open questions (fill these in, they shape the build)

**Shopify EDD app:**
- [ ] **App name** — decide after Phase 0 immersion. Keywords to work in: delivery, arrives, ETA, estimated, date.
- [ ] **Cutoff time granularity** — one global cutoff (recommended for v1), or per shipping method?
- [ ] **Companion app (#2)** — let Phase 0 surface it. Candidates: pre-order / back-in-stock, order tracking widget, shipping protection.
- [ ] **When does Phase 0 start?** Zero cost, zero code. Can start this week.

**Shopify EDD app:**
- [ ] **App name** — keywords to work in: delivery, arrives, ETA, estimated, date.
- [ ] **Cutoff time granularity** — global for v1 (recommended), or per shipping method?
- [ ] **Phase 0 start date** — can start this week. When?

**Llamas Cookbook (iOS):**
- [ ] **App Store name** — keyword-first recommended: "Llamas Cookbook: Cook Mode & Timer" or similar.
- [x] **Subscription pricing** — $2.99/mo · **$29.99/yr** (~16% annual discount). Simple, real incentive to go annual.
- [x] **Landing page** — none yet. Needs to be built before or alongside App Store submission. Lorenzo has the skill to do this fast (Next.js). Options: standalone site or a route on the portfolio.

---

## Resources

- [Shopify Partner Program](https://partners.shopify.com) — free account, dev stores
- [Build a Shopify app with Remix (official)](https://shopify.dev/docs/apps/build/build?framework=remix)
- [Shopify Remix app template (GitHub)](https://github.com/Shopify/shopify-app-template-remix)
- [Theme app extensions (official docs)](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions)
- [Shopify Billing API](https://shopify.dev/docs/apps/launch/billing)
- [Revenue share policy](https://shopify.dev/docs/apps/launch/distribution/revenue-share)
- [Polaris design system](https://polaris.shopify.com)
- [r/shopify](https://reddit.com/r/shopify) — Phase 0 listening post
- [Indie Hackers — Shopify bootstrapped stories](https://www.indiehackers.com) — search "shopify"
- [Starter Story — Shopify app success stories](https://www.starterstory.com/ideas/shopify-app)

---

_Last updated: May 2026. Next: answer the open questions, start Phase 0._
