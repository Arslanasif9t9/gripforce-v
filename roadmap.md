# Grip Force — Roadmap

## Phase 1 — Storefront (complete)
- [x] Brand: logo, favicon, black + neon green design system
- [x] Static catalog: 16 pictured products plus the Starter Kit, 9 collections, placeholder USD prices
- [x] Pages: home, shop, collections, product, cart, search, about, contact, FAQ,
      policies (shipping/returns/privacy/terms), payment info, size guide, track
- [x] Cart working on browser storage; checkout button reserved for Shopify launch
- [x] Product photos supplied and mapped to the 16-product catalog
- [ ] Owner sends real prices (or sync from Shopify later)

## Phase 2 — Database + admin panel (in progress)
- [x] Enable Lovable Cloud
- [x] Owner-only admin role (DB trigger + RLS) — done in DB
- [ ] Sign-in / sign-up page and admin route guard (UI)
- [x] Database tables: products, orders, order items, coupons, promo banners,
      settings, support messages (`drizzle/migrations/0000_...`)
- [x] Seed SQL written: `drizzle/seeds/001_seed_products.sql` (17 products)
- [ ] Run the seed in Lovable and verify count = 17
- [ ] Switch storefront reads from code catalog to DB
- [ ] Admin dashboard adapted from the R.Z Shoes ZIP: products, orders,
      customers, marketing (badges/coupons), settings, support
- [ ] Customer account/order history, order tracking, reviews

## Phase 3 — Shopify connection + launch
- [ ] Connect owner's existing Shopify store "Grip Force" (store_type: existing)
- [ ] Sync products, prices, images to Shopify
- [ ] Cart → Shopify secure checkout; payment provider (Pakistan merchant) config
- [ ] Shipping rates, markets/USD, policies finalized in Shopify admin
- [ ] Owner guide: how to run the store day to day in Shopify admin


## Docs (always keep updated)
- [x] README.md, HANDOVER.md, docs/DATABASE.md, docs/CHANGELOG.md created 2026-11-09
- [ ] After every change: update CHANGELOG, roadmap, and DATABASE.md if the DB changed
