import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { formatPrice, productPath, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={productPath(product)}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/70"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.07]"
        />
        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 neon-edge" />
        {product.isNew && <span className="badge-neon absolute left-3 top-3">New</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{product.collectionName}</p>
        <h3 className="line-clamp-2 font-display text-lg leading-tight text-foreground">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-xl text-primary">{formatPrice(product.price)}</span>
          <button
            onClick={quickAdd}
            className="btn-add rounded-md border border-primary/70 px-3 py-1.5 font-display text-sm uppercase tracking-wider text-primary"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
