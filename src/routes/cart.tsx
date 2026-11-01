import { createFileRoute, Link } from "@tanstack/react-router";
import { cartItemImage, clearCart, removeFromCart, updateQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Grip Force" },
      { name: "description", content: "Review the fitness accessories in your Grip Force cart before checkout." },
      { property: "og:title", content: "Your Cart — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();

  if (cart.lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="heading-section">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Add some accessories and get training.</p>
        <Link to="/shop" className="btn-neon mt-8">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="heading-section">Your Cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">{cart.count} item{cart.count === 1 ? "" : "s"}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {cart.lines.map((line) => (
            <li key={`${line.slug}-${line.size ?? ""}`} className="flex gap-4 p-4">
              <Link to="/product/$slug" params={{ slug: line.slug }} className="shrink-0">
                <img
                  src={cartItemImage(line)}
                  alt={line.product.name}
                  className="size-24 rounded-lg object-cover"
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-1">
                <Link to="/product/$slug" params={{ slug: line.slug }} className="font-display text-lg leading-tight hover:text-primary">
                  {line.product.name}
                </Link>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {line.product.collectionName}
                  {line.size ? ` · Size ${line.size}` : ""}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      onClick={() => updateQty(line.slug, line.size, line.qty - 1)}
                      className="px-3 py-1.5 hover:text-primary"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{line.qty}</span>
                    <button
                      onClick={() => updateQty(line.slug, line.size, line.qty + 1)}
                      className="px-3 py-1.5 hover:text-primary"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg text-primary">{formatPrice(line.lineTotal)}</span>
                    <button
                      onClick={() => removeFromCart(line.slug, line.size)}
                      className="text-sm text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${line.product.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-display text-lg text-foreground">{formatPrice(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-muted-foreground">Calculated at checkout</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="font-display text-xl uppercase">Total</span>
              <span className="font-display text-2xl text-primary">{formatPrice(cart.subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Prices in USD</p>
          </div>
          <button className="btn-neon mt-6 w-full" onClick={() => undefined} disabled title="Checkout launches with the store opening">
            Proceed to Checkout
          </button>
          <p className="mt-3 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-center text-xs text-primary">
            Secure checkout launches with the Grip Force store opening.
          </p>
          <button
            onClick={clearCart}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-destructive"
          >
            Clear cart
          </button>
          <Link to="/shop" className="mt-4 block text-center font-display text-base uppercase tracking-wider text-foreground hover:text-primary">
            ← Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
