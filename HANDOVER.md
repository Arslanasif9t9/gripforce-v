# Grip Force — Handover

Last updated: 2026-11-09

## 1. Working rules
- **Code changes:** edit the repo and push to GitHub (`main`). Lovable syncs from GitHub.
- **Database, backend and settings changes** (tables, RLS, triggers, storage, auth settings, secrets): run SQL in **Lovable Cloud → SQL editor**. Then save the SQL as the next file in `drizzle/migrations/` (or `drizzle/seeds/`), update `docs/DATABASE.md`.
- Never force-push or rewrite git history.
- Every change updates: `docs/CHANGELOG.md`, `roadmap.md`, and `docs/DATABASE.md` if the DB changed.
- Brand colors live only in `src/styles.css`. Use semantic classes, no raw colors (see `AGENTS.md`).
- No fake reviews, fake countdowns or invented product claims.
- Run before every push: `npm run build`, `npx tsc --noEmit`, `npm run test`.

## 2. Current status
| Phase | State |
|---|---|
| 1. Storefront (UI) | Done |
| 2. Database + admin | **Done** (see section 3) |
| 3. Shopify connection + launch | Not started. Needs the owner's Shopify access |

## 3. What the website can do now
**Public site**
- Shop, collections, product pages, search, cart (browser storage), policies, size guide, contact form.
- Products come from the **database** (`published` only). If the DB has none or is unreachable, the built-in list `src/lib/catalog-data.ts` is used.
- Top green bar shows the active banner from admin.
- Contact form saves messages to the DB (guests and signed-in).
- Sign in / sign up / Google / forgot password.

**Admin (`/admin`, owner only)**
- Dashboard (live counts), Products (add, edit, hide/publish, delete, image upload, **Export Shopify CSV**), Coupons, Banners, Support inbox, Orders (info page: orders live in Shopify).

**Not built (on purpose)**
- Own order/checkout system. Shopify checkout does payments and orders (Phase 3).
- Coupons are stored but cannot be applied until Shopify discount codes are set up (Phase 3).
- Settings page (the `store_settings` table is admin-only, so the public site cannot read it).

## 4. Where things are
- Pages: `src/routes/*.tsx`. Admin: `src/routes/admin*.tsx`. Login: `login.tsx`, `reset-password.tsx`
- Catalog: DB loader `src/lib/catalog-store.ts`; fallback data `src/lib/catalog-data.ts`; helpers + collections `src/lib/catalog.ts`
- Cart: `src/lib/cart.ts` (localStorage key `grip-force-cart-v1`)
- Auth: `src/lib/auth.tsx` (`useAuth`)
- Admin helpers: `src/lib/admin-products.ts`, `admin-utils.ts`, `product-images.ts`, `shopify-csv.ts`, `banners.ts`; shared UI `src/components/admin/`
- Supabase client + types: `src/integrations/supabase/` (auto-generated, do not edit by hand)
- SQL: `drizzle/migrations/`, `drizzle/seeds/`
- Old Lovable plans: `.lovable/plan/`

## 5. GO-LIVE CHECKLIST (do in this order)
1. **Lovable SQL editor** — easiest: paste the whole file `drizzle/go-live-all.sql` and run it ONCE (it shows a check row: 17 / 1 / YES). Or run the files one by one, in order:
   1. `drizzle/migrations/0001_guest_support_messages.sql`
   2. `drizzle/migrations/0002_product_images_storage.sql`
   3. `drizzle/seeds/001_seed_products.sql` (result must show `17`)
2. **GitHub** — push this repo to `main`. Lovable rebuilds.
3. **Create the owner account** — open `/login` → Create an account with the owner email stored in function `assign_grip_force_admin` → confirm the email → sign in. `/admin` opens. (If the account existed before, use the SQL in `docs/DATABASE.md` → "How to become admin".)
4. **Check Lovable auth settings** — email confirmation must stay ON (the admin trigger needs a verified email). Check the Google sign-in provider is enabled if you want the Google button.
5. **Test:** edit a product, upload an image, hide/publish, add a banner, send a message from `/contact`, open it in `/admin/support`.

## 6. Known issues and decisions
1. Owner admin email is hard-coded inside trigger `assign_grip_force_admin`. To change it, write a new migration.
2. Old product images look like `/__l5e/assets-v1/...`. They work on the Lovable-hosted site only. Moving to another host means re-uploading images in admin (Storage).
3. If ALL products are hidden/deleted, the shop shows the built-in list (so it is never empty).
4. Prices are placeholder PKR until the owner sends real prices or Shopify sync.
5. Collections are fixed in code (`COLLECTIONS` in `src/lib/catalog.ts`). A new collection needs a code change.
6. Support messages from guests are public-insert (size-limited). If spam appears, add a captcha or a rate limit.
7. Tables `orders` / `order_items` exist but are unused (Shopify handles orders). Keep or drop later.
8. `npm run build` output uses a Cloudflare worker format; local `vite preview` may not start in some sandboxes. Use `npm run dev`.

## 7. Next (Phase 3 — needs owner's Shopify)
1. In admin → Products → **Export Shopify CSV** → Shopify admin → Products → Import.
2. Connect cart → Shopify secure checkout (Storefront API or cart permalinks). Needs Shopify store access.
3. Payment provider, shipping rates, taxes, policies finalized in Shopify admin.
4. Recreate coupons as Shopify discount codes.
5. Owner guide: running the store day to day.

## 8. Handing the project to someone else
Send the full ZIP of this repo. The new person reads `README.md` → `HANDOVER.md` → `docs/DATABASE.md`. They also need access to the GitHub repo and the Lovable project (for DB changes). Secrets are never in the repo.
