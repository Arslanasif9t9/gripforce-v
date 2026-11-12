# Changelog

## 2026-11-09
- Continued the project outside Lovable (credits finished). Work rule: code via GitHub, DB/settings via Lovable.
- Added `README.md` (clean), `HANDOVER.md`, `docs/DATABASE.md`, `docs/CHANGELOG.md`.
- Moved the owner's old README notes to `docs/ORIGINAL_BRIEF.md`.
- Added `drizzle/seeds/001_seed_products.sql` (17 products, generated from `catalog-data.ts`).
- Updated `roadmap.md`.

## 2026-11-09 (Step 8 — packaging)
- Added `drizzle/go-live-all.sql`: migration 0001 + 0002 + seed in one file with a final check query. Run once.

## 2026-11-09 (Step 7 — final)
- **DB change:** `drizzle/migrations/0002_product_images_storage.sql` (Storage bucket + admin-only write policies). Run BEFORE pushing the code.
- Product form: upload main image and gallery images (JPG/PNG/WebP, max 5 MB) to Storage.
- Products list: **Export Shopify CSV** (`src/lib/shopify-csv.ts`). Tested with all 17 products: sizes become variants, extra images get own rows, drafts stay draft, relative image links get the site address.
- `/admin/orders` is an info page: orders are handled by Shopify checkout (Phase 3). No own order system by design.
- Sidebar finished: Dashboard, Products, Coupons, Banners, Support, Orders.
- `HANDOVER.md` rewritten with the go-live checklist.

## 2026-11-09 (Step 6)
- **DB change:** `drizzle/migrations/0001_guest_support_messages.sql` (run in Lovable BEFORE pushing the code). `src/integrations/supabase/types.ts` was edited by hand for the nullable `user_id` (Lovable will regenerate the same).
- Contact page now really saves messages to `support_messages` (before, it only pretended to send).
- Added `/admin/support` inbox: filter by status, read, reply by email, change status, delete.
- Added forgot-password: link on `/login`, new page `/reset-password`.
- Settings admin page postponed on purpose: `store_settings` is admin-only, so public pages cannot read it. It needs a public-read policy, planned with checkout (shipping settings).

## 2026-11-09 (Step 5)
- Added admin pages: `/admin/coupons` and `/admin/banners` (list, add, edit, turn on/off, delete) with validation.
- New helpers: `src/lib/admin-utils.ts` (date/link helpers), `src/components/admin/ui.tsx` (shared form pieces), `src/lib/banners.ts` (`useActiveBanner`).
- Header: the top green bar now shows the first active banner (inside its dates). If none, it shows the default text.
- Coupons are only stored for now. They are applied when the order system is built.
- No DB change.

## 2026-11-09 (Step 4)
- Public shop now reads products from the database (`products`, only `published`). New file `src/lib/catalog-store.ts` (`useCatalog`, `fetchCatalog`).
- Safe fallback: if the DB has no published products or cannot be reached, the built-in list `catalog-data.ts` is used.
- Updated: home, shop, collections, search, product page (now uses a `loader`, so DB-only products work and unknown slugs give 404), cart (finds products from the active catalog), root (`CatalogLoader`).
- Admin product changes now refresh the shop cache (`["catalog"]`).
- `catalog.ts` helper functions take an optional product list. Collections still come from code (`COLLECTIONS`).
- No DB change.

## 2026-11-09 (Step 3)
- Added Products admin: `/admin/products` (list, search, status filter, Hide/Publish, Delete), `/admin/products/new`, `/admin/products/$id` (edit).
- Added `src/lib/admin-products.ts` (types, form helpers, validation, slugify) and `src/components/admin/product-form.tsx`.
- Sidebar: Products is now a link. Images are pasted as URLs (upload comes later).
- No DB change. Uses existing RLS: admin can read/insert/update/delete `products`.

## 2026-11-09 (Step 2)
- Added `src/lib/auth.tsx` (AuthProvider + `useAuth`: user, isAdmin, loading, signOut). `isAdmin` uses DB function `has_role('admin')`.
- Added pages: `/login` (email + password, sign up, Google), `/admin` (guarded layout), `/admin/` (dashboard with live counts).
- `__root.tsx` now wraps the site in `AuthProvider`. Header got an account icon (goes to `/login` or `/admin`).
- `routeTree.gen.ts` regenerated (auto-generated, do not edit).
- No DB change in this step.

## 2026-11-01 and before (done in Lovable)
- Phase 1 storefront, 3D hero, real product photos, Phase 2 DB foundation (`0000_phase2_store_and_access_foundation.sql`).
