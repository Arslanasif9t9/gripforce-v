CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  );
$$;
REVOKE ALL ON FUNCTION public.has_role(public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.assign_grip_force_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(COALESCE(NEW.email, '')) = 'arslanpixel9t9@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles
    WHERE user_id = NEW.id AND role = 'admin'::public.app_role;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.assign_grip_force_admin() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER grip_force_assign_owner_admin
  AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_grip_force_admin();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  collection_handle text NOT NULL,
  collection_name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  image_url text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  sizes text[],
  is_new boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are public" ON public.products
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can read all products" ON public.products
  FOR SELECT TO authenticated USING (public.has_role('admin'::public.app_role));
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role('admin'::public.app_role));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role('admin'::public.app_role));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  shipping_total numeric(10,2) NOT NULL DEFAULT 0 CHECK (shipping_total >= 0),
  total numeric(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  tracking_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can read their own orders" ON public.orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  line_total numeric(10,2) NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can read items in their own orders" ON public.order_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "Admins can manage order items" ON public.order_items
  FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));

CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0),
  active boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit integer CHECK (usage_limit IS NULL OR usage_limit > 0),
  usage_count integer NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active coupons are public" ON public.coupons
  FOR SELECT TO anon, authenticated USING (
    active = true AND (starts_at IS NULL OR starts_at <= now()) AND (expires_at IS NULL OR expires_at > now())
  );
CREATE POLICY "Admins can read all coupons" ON public.coupons
  FOR SELECT TO authenticated USING (public.has_role('admin'::public.app_role));
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));

CREATE TABLE public.promo_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  image_url text,
  href text,
  active boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promo_banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promo_banners TO authenticated;
GRANT ALL ON public.promo_banners TO service_role;
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active promotions are public" ON public.promo_banners
  FOR SELECT TO anon, authenticated USING (
    active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at > now())
  );
CREATE POLICY "Admins can read all promotions" ON public.promo_banners
  FOR SELECT TO authenticated USING (public.has_role('admin'::public.app_role));
CREATE POLICY "Admins can manage promotions" ON public.promo_banners
  FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));

CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage store settings" ON public.store_settings
  FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));

CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.support_messages TO authenticated;
GRANT UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can submit support messages" ON public.support_messages
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Customers can read their own support messages" ON public.support_messages
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage support messages" ON public.support_messages
  FOR ALL TO authenticated USING (public.has_role('admin'::public.app_role))
  WITH CHECK (public.has_role('admin'::public.app_role));

CREATE INDEX products_status_order_idx ON public.products (status, sort_order, created_at);
CREATE INDEX orders_user_created_idx ON public.orders (user_id, created_at DESC);
CREATE INDEX orders_status_created_idx ON public.orders (status, created_at DESC);
CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);
CREATE INDEX support_messages_user_created_idx ON public.support_messages (user_id, created_at DESC);