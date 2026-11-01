import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { formatPrice, productImage, productPath, type Product } from "@/lib/catalog";

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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-square overflow-hidden bg-light-bg">
        <img
          src={productImage(product)}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="badge-neon absolute left-3 top-3">New</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{product.collectionName}</p>
        <h3 className="line-clamp-2 font-display text-lg leading-tight text-foreground">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-xl text-primary">{formatPrice(product.price)}</span>
          <button
            onClick={quickAdd}
            className="rounded-md border border-primary/70 px-3 py-1.5 font-display text-sm uppercase tracking-wider text-primary transition hover:bg-primary hover:text-primary-foreground"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
