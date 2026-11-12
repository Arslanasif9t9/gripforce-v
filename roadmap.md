# Grip Force — Roadmap

## Phase 1 — Storefront (complete)
- [x] Brand: logo, favicon, black + neon green design system
- [x] Static catalog: 16 pictured products plus the Starter Kit, 9 collections, placeholder USD prices
- [x] Pages: home, shop, collections, product, cart, search, about, contact, FAQ,
      policies (shipping/returns/privacy/terms), payment info, size guide, track
- [x] Cart working on browser storage; checkout button reserved for Shopify launch
- [x] Product photos supplied and mapped to the 16-product catalog
- [ ] Owner sends real prices (or sync from Shopify later)

## Phase 2 — Database + admin panel (code complete; run the go-live checklist in HANDOVER.md)
- [x] Enable Lovable Cloud
- [x] Owner-only admin role (DB trigger + RLS) — done in DB
- [x] Sign-in / sign-up page and admin route guard (UI) — `/login`, `/admin`
- [ ] Test admin login with the owner email (after seed + email confirm)
- [x] Admin: Products (list, add, edit, hide/publish, delete) — Step 3
- [x] Admin: Coupons and Banners (header banner is live) — Step 5
- [x] Admin: Support inbox + contact form saves + forgot-password — Step 6 (needs migration 0001)
- [x] Admin: Orders info page (orders = Shopify). Settings page postponed to Phase 3
- [x] Product image upload (Storage, migration 0002) and Export Shopify CSV — Step 7
- [ ] Apply coupons at checkout -> moved to Phase 3 (Shopify discount codes)
- [x] Database tables: products, orders, order items, coupons, promo banners,
      settings, support messages (`drizzle/migrations/0000_...`)
- [x] Seed SQL written: `drizzle/seeds/001_seed_products.sql` (17 products)
- [ ] Run the seed in Lovable and verify count = 17
- [x] Switch storefront reads from code catalog to DB (with static fallback) — Step 4
- [x] Admin dashboard: products, coupons, banners, support, orders info
- [ ] Not built: customer order history, order tracking page, product reviews, Settings page (Shopify decides orders; revisit in Phase 3)

## Phase 3 — Shopify connection + launch
- [ ] Connect owner's existing Shopify store "Grip Force" (store_type: existing)
- [ ] Sync products, prices, images to Shopify
- [ ] Cart → Shopify secure checkout; payment provider (Pakistan merchant) config
- [ ] Shipping rates, markets/USD, policies finalized in Shopify admin
- [ ] Owner guide: how to run the store day to day in Shopify admin


## Docs (always keep updated)
- [x] README.md, HANDOVER.md, docs/DATABASE.md, docs/CHANGELOG.md created 2026-11-09
- [ ] After every change: update CHANGELOG, roadmap, and DATABASE.md if the DB changed
