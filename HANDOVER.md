# Grip Force — Handover

Last updated: 2026-11-09

## 1. Working rules
- **Code changes** are made in this repo and pushed to GitHub (`main`). Lovable syncs from GitHub.
- **Database, backend and settings changes** (tables, RLS, triggers, auth settings, secrets) are done in **Lovable Cloud** (SQL editor / settings). Then the change is written into `docs/DATABASE.md` and a new file in `drizzle/migrations/` or `drizzle/seeds/`.
- Do **not** force-push or rewrite git history (Lovable would lose history).
- Every change must update: `docs/CHANGELOG.md`, `roadmap.md`, and `docs/DATABASE.md` if the DB changed.
- Brand colors live only in `src/styles.css`. Use semantic classes, no raw colors (see `AGENTS.md`).
- No fake reviews, fake countdowns or invented product claims.

## 2. Current status
| Phase | State |
|---|---|
| 1. Storefront (UI) | Done |
| 2. Database + admin | **In progress.** DB foundation exists. Login, admin pages and DB-backed catalog are NOT built yet |
| 3. Shopify connection + launch | Not started |

The storefront still reads products from code: `src/lib/catalog-data.ts` and `src/lib/catalog.ts`. The cart is in browser localStorage (`grip-force-cart-v1`). Nothing in the UI calls the database yet.

## 3. Where things are
- Pages: `src/routes/*.tsx` (home, shop, collections.$handle, product.$slug, cart, search, about, contact, faq, track, payment-info, size-guide, policies.*)
- Components: `src/components/` (header, footer, product card, rail, 3D hero, motion). UI kit: `src/components/ui/`
- Catalog (static): `src/lib/catalog-data.ts`, `src/lib/catalog.ts`
- Cart logic: `src/lib/cart.ts`
- Supabase client and auth helpers: `src/integrations/supabase/` (auto-generated, do not edit by hand)
- DB SQL: `drizzle/migrations/`, seeds: `drizzle/seeds/`
- Old Lovable plans: `.lovable/plan/`

## 4. Known issues and decisions
1. No login/sign-up page yet, so nobody can become admin.
2. `products` table is empty until `drizzle/seeds/001_seed_products.sql` is run.
3. `orders.user_id` is NOT NULL, so guest orders are impossible. Decide before checkout (Shopify checkout may make this unused).
4. Owner admin email is hard-coded inside the trigger `assign_grip_force_admin`. To change it, write a new migration.
5. Product image URLs look like `/__l5e/assets-v1/...`. They work on the Lovable-hosted site. If the site moves to another host, images must be moved to Supabase Storage or `public/`.
6. Prices are placeholder USD. Real prices come in Phase 3 (Shopify).
7. A separate Shopify Liquid theme version exists (plan B). It is not part of this repo.

## 5. Next steps
1. Run the seed SQL in Lovable (see `docs/DATABASE.md` section 6).
2. Add sign-in page and admin guard.
3. Admin panel: products, orders, coupons, banners, settings, support.
4. Switch storefront to DB catalog after checking the data.
5. Phase 3: Shopify.

## 6. How to hand this project to someone else
Send the full ZIP of this repo. The new person reads `README.md` → `HANDOVER.md` → `docs/DATABASE.md`. They also need access to the Lovable project (for DB changes) and the GitHub repo.
