import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersInfo,
});

function OrdersInfo() {
  return (
    <div>
      <h1 className="heading-section">Orders</h1>
      <div className="mt-5 grid gap-4 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Grip Force uses <strong className="text-foreground">Shopify secure checkout</strong>. Payments, orders, shipping labels,
          tracking and refunds are all managed in your <strong className="text-foreground">Shopify admin</strong>, not here. This keeps card
          data away from this website.
        </p>
        <p>
          Today the cart works in the browser only and checkout is reserved for the store opening (Phase 3). What you manage here: products,
          coupons, banners and support messages.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/products" className="btn-neon">Go to products</Link>
        </div>
        <p className="text-xs">
          To move products to Shopify: Products → <em>Export Shopify CSV</em>, then Shopify admin → Products → Import.
        </p>
      </div>
    </div>
  );
}
