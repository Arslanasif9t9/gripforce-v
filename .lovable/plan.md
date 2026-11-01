# Grip Force — Store Plan (Phase 1: Frontend Only)

## What we are building
Your reference ZIP (R.Z Shoes) is a Lovable app built on TanStack Start + Tailwind. We rebuild the same architecture in this project, converted into the **Grip Force** fitness accessories store per your GRIP_FORCE requirements doc — same kind of header/footer, product cards, category pages, product pages, cart, and (later) the same kind of admin panel/dashboard/marketing the ZIP has.

Your answers:
- Shopify: **connect your existing store** (done after this plan is approved — Lovable will show a connect button where you open your Shopify admin link)
- Phase 1 checkout: **cart works now, real checkout comes with the Shopify connection**
- Prices: **sensible placeholder USD prices** now; real prices come from Shopify later

## Brand
- Matte black #101010 base, neon green #A3FF12 for buttons/highlights/sale badges, white + light grey #F3F4F4 for readable product sections, dark grey #242424.
- Bold, modern gym typography (heavy condensed display font + clean body font), tagline "TRAIN HARD. GRIP STRONG."
- New Grip Force logo + favicon (generated in Phase 1).

## Phase 1 — Storefront, no database/backend/admin
All product data lives in code (static catalog file), so nothing else is needed to run it.

1. **Design system** — rewrite `src/styles.css` tokens to the black/neon-green palette, bold fonts, consistent product-card, buttons, badges; dark premium look with light product sections.
2. **Static catalog** — all 90 products from your uploaded title/description files, mapped to the required categories (Hand & Grip, Gym Gloves, Strength, Home Workout, Resistance Bands, Bags, Hydration, Recovery & Mobility, Bundles). Placeholder USD prices, placeholder images (replaced when you send product pictures), sizes/variants where relevant, badges (NEW / FEATURED).
3. **Pages** (each with proper SEO titles/descriptions):
   - `/` homepage: announcement bar, header (logo, nav with dropdown mega-menu, search, account, cart, mobile menu), hero "BUILD YOUR GRIP. OWN YOUR STRENGTH." with SHOP NOW + EXPLORE HOME FITNESS, category cards, Featured Products, Home Workout collection, Gym Essentials, Bundles, Why Grip Force, FAQ, newsletter, full footer with policy links.
   - `/shop` Shop All with category filters and sorting.
   - `/collections/$handle` for each main category.
   - `/product/$slug` product page: gallery, price, description, key features, specs, variants, quantity, Add to Cart, Buy Now (enabled once checkout connects), shipping/returns info, related products.
   - `/cart` — working cart (browser storage), quantities, totals in USD.
   - `/search` — live product search.
   - `/about`, `/contact`, `/faq`, policy pages (`/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`), payment info, size/care guide.
   - Checkout button: visible but says checkout launches with the Shopify connection (per your choice).
   - No fake reviews, no fake countdowns, no invented claims — per your requirements.
4. **Logo, favicon, hero/banner art** generated in the brand style.

## Phase 2 — Database, accounts, admin panel (after you approve)
- Enable Lovable Cloud: products, orders, customers in the database.
- Admin panel + dashboard adapted from your ZIP: products manager, orders, customers, marketing (badges/coupons), settings, support chat.
- Customer accounts, order tracking, reviews.

## Phase 3 — Shopify connection and launch
1. Right after plan approval I call the Shopify connect flow for your **existing Grip Force store** (you click the approval and open your Shopify admin link).
2. Sync products/prices/images to Shopify; cart routes to Shopify's secure checkout (your card payments/bank-transfer setup is configured in Shopify admin — no custom payment forms).
3. I then give you the simple step-by-step of what to do inside Shopify admin (payment provider for Pakistan, shipping rates, markets/USD, policies) and what stays handled by the connected store.

## What I need from you later
- Product pictures (any time — I'll drop them into the catalog).
- Real prices (or they sync from Shopify once connected).
- Your Shopify admin link when connecting the store.

## Not doing in Phase 1
No database, no admin panel, no real checkout, no backend code — that's Phase 2/3 as agreed.
