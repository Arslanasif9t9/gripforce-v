# Grip Force — Database

Database: Postgres on Lovable Cloud (Supabase). Project ref: `tbsmtforbipflkmhbuax`.
Source of truth for structure: `drizzle/migrations/*.sql`. Types for code: `src/integrations/supabase/types.ts` (auto-generated).

> Rule: if you change the DB in Lovable, add the SQL to `drizzle/migrations/` (next number), update this file, and add a line to `docs/CHANGELOG.md`.

## 1. Migrations applied
| File | What |
|---|---|
| `0000_phase2_store_and_access_foundation.sql` | Roles, admin trigger, 7 tables, RLS, indexes |

Seeds (data, run by hand): `drizzle/seeds/001_seed_products.sql`

## 2. Roles and admin
- Enum `app_role`: `admin`, `moderator`, `user`.
- Table `user_roles(user_id, role)`. A user can read only their own roles.
- Function `has_role(_role)` (security definer). Every admin RLS policy uses it.
- Trigger `grip_force_assign_owner_admin` on `auth.users`: gives `admin` only when the email is **verified** and equals the owner email (written inside function `assign_grip_force_admin`). Otherwise the admin role is removed.

## 3. Tables
### products
`id`, `slug` (unique), `name`, `description`, `features text[]`, `collection_handle`, `collection_name`, `price numeric(10,2) >= 0`, `image_url`, `gallery text[]`, `sizes text[] null`, `is_new`, `is_featured`, `status` (`draft|published|archived`), `sort_order`, `created_at`, `updated_at`
- Public (anon + signed in): only `status = 'published'`.
- Admin: read all, insert, update, delete.

### orders
`id`, `user_id` (NOT NULL), `order_number` (unique), `customer_name`, `customer_email`, `customer_phone`, `shipping_address jsonb`, `status` (`pending|confirmed|processing|shipped|delivered|cancelled`), `subtotal`, `shipping_total`, `total`, `tracking_number`, `created_at`, `updated_at`
- Customer: read own orders only. Admin: all actions.

### order_items
`id`, `order_id` → orders (cascade), `product_id` (no FK on purpose, so history stays), `product_slug`, `product_name`, `quantity > 0`, `unit_price`, `line_total`, `created_at`
- Customer: read items of own orders. Admin: all actions.

### coupons
`id`, `code` (unique), `discount_type` (`percentage|fixed`), `discount_value > 0`, `active`, `starts_at`, `expires_at`, `usage_limit`, `usage_count`, `created_at`, `updated_at`
- Public: only active coupons inside the date window. Admin: all actions.

### promo_banners
`id`, `title`, `body`, `image_url`, `href`, `active`, `starts_at`, `ends_at`, `sort_order`, `created_at`, `updated_at`
- Public: active and inside the date window. Admin: all actions.

### store_settings
`id`, `setting_key` (unique), `setting_value jsonb`, `updated_at`
- Admin only.

### support_messages
`id`, `user_id`, `customer_name`, `customer_email`, `subject`, `message`, `status` (`open|in_progress|closed`), `created_at`, `updated_at`
- Customer: insert and read own. Admin: all actions.

### user_roles
See section 2.

## 4. Indexes
`products(status, sort_order, created_at)`, `orders(user_id, created_at desc)`, `orders(status, created_at desc)`, `order_items(order_id)`, `support_messages(user_id, created_at desc)`

## 5. Known gaps (to decide later)
- No automatic `updated_at` trigger. The app must set it.
- Public coupon read exposes all active coupon codes. Better: validate by a server function.
- Guest checkout is not possible (`orders.user_id` NOT NULL).
- No reviews table yet (planned Phase 2).
- No Storage bucket yet for admin image upload.

## 6. How to run SQL (Lovable)
1. Open the Lovable project → Cloud → Database → SQL editor.
2. Paste the file content and run.
3. Check with:
```sql
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;
```
4. To fill products: run `drizzle/seeds/001_seed_products.sql`. Expected result: `17`.
