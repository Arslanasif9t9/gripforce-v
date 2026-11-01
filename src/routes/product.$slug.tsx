import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { addToCart } from "@/lib/cart";
import { formatPrice, getProduct, productImage, relatedProducts } from "@/lib/catalog";

export const Route = createFileRoute("/product/$slug")({
  beforeLoad: ({ params }) => {
    if (!getProduct(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) return { meta: [{ title: "Product not found — Grip Force" }] };
    return {
      meta: [
        { title: `${product.name} — Grip Force` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — Grip Force` },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const related = relatedProducts(product);
  const [size, setSize] = useState<string | null>(product.sizes?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState(false);

  const add = () => {
    addToCart(product.slug, size, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const buyNow = () => {
    addToCart(product.slug, size, qty);
    setCheckoutNote(true);
  };

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span>{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> <span aria-hidden>/</span>{" "}
        <Link to="/collections/$handle" params={{ handle: product.collection }} className="hover:text-primary">
          {product.collectionName}
        </Link>{" "}
        <span aria-hidden>/</span> {product.name}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-light-bg">
            <img
              src={productImage(product)}
              alt={product.name}
              className="aspect-square size-full object-cover"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Product photos are being updated — the final photography will match the exact item you receive.
          </p>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.collectionName}</p>
          <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-3xl text-primary">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Price shown in USD</p>

          <p className="mt-6 leading-relaxed text-foreground/90">{product.description}</p>

          {product.sizes && (
            <div className="mt-6">
              <h2 className="font-display text-lg uppercase tracking-wider">Size</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`min-w-12 rounded-md border px-4 py-2 font-display text-lg ${
                      size === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Link to="/size-guide" className="mt-2 inline-block text-sm text-primary underline">
                Size guide
              </Link>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-lg hover:text-primary"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-display text-xl" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="px-4 py-3 text-lg hover:text-primary"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button onClick={add} className="btn-neon flex-1 min-w-40">
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <button onClick={buyNow} className="btn-outline-dark flex-1 min-w-40">
              Buy Now
            </button>
          </div>

          {checkoutNote && (
            <p className="mt-4 rounded-lg border border-primary/50 bg-primary/10 px-4 py-3 text-sm text-primary">
              Saved to your cart. Secure online checkout launches with our store opening — you'll check out there.
            </p>
          )}

          <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-card px-5">
            <div className="py-4">
              <dt className="font-display text-base uppercase tracking-wider text-foreground">Shipping</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                Orders ship from our own inventory with tracking. Shipping options and rates are shown at checkout.{" "}
                <Link to="/policies/shipping" className="text-primary underline">Shipping policy</Link>
              </dd>
            </div>
            <div className="py-4">
              <dt className="font-display text-base uppercase tracking-wider text-foreground">Returns</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                Changed your mind? Our returns policy explains the conditions and steps.{" "}
                <Link to="/policies/returns" className="text-primary underline">Returns & refunds</Link>
              </dd>
            </div>
            <div className="py-4">
              <dt className="font-display text-base uppercase tracking-wider text-foreground">Product code</dt>
              <dd className="mt-1 text-sm text-muted-foreground">SKU GF-{product.slug.toUpperCase().slice(0, 24)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Related */}
      <section className="mt-16">
        <h2 className="heading-section">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
