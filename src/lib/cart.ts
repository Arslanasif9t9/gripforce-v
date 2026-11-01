import { useEffect, useState } from "react";
import { PRODUCTS, getProduct, productImage, type Product } from "./catalog";

const STORAGE_KEY = "grip-force-cart-v1";

export type CartItem = {
  slug: string;
  size: string | null;
  qty: number;
};

type CartLine = CartItem & {
  product: Product;
  lineTotal: number;
};

export type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
};

function readRaw(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i.slug === "string" && Number.isFinite(i.qty) && i.qty > 0)
      .map((i) => ({ slug: i.slug, size: typeof i.size === "string" ? i.size : null, qty: Math.floor(i.qty) }));
  } catch {
    return [];
  }
}

function writeRaw(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable — cart stays in memory for this page view
  }
  window.dispatchEvent(new Event("grip-force-cart"));
}

function compute(items: CartItem[]): CartState {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) continue;
    lines.push({ ...item, product, lineTotal: product.price * item.qty });
  }
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
  };
}

export function addToCart(slug: string, size: string | null = null, qty = 1) {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return;
  const items = readRaw();
  const existing = items.find((i) => i.slug === slug && i.size === size);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 99);
  } else {
    items.push({ slug, size, qty: Math.min(Math.max(1, qty), 99) });
  }
  writeRaw(items);
}

export function updateQty(slug: string, size: string | null, qty: number) {
  let items = readRaw();
  if (qty <= 0) {
    items = items.filter((i) => !(i.slug === slug && i.size === size));
  } else {
    const item = items.find((i) => i.slug === slug && i.size === size);
    if (item) item.qty = Math.min(Math.floor(qty), 99);
  }
  writeRaw(items);
}

export function removeFromCart(slug: string, size: string | null) {
  writeRaw(readRaw().filter((i) => !(i.slug === slug && i.size === size)));
}

export function clearCart() {
  writeRaw([]);
}

export function readCartState(): CartState {
  return compute(readRaw());
}

/** Subscribes to cart changes across tabs and within the page. */
export function useCart(): CartState {
  const [state, setState] = useState<CartState>(() =>
    typeof window === "undefined" ? { lines: [], count: 0, subtotal: 0 } : compute(readRaw()),
  );

  useEffect(() => {
    const refresh = () => setState(compute(readRaw()));
    refresh();
    window.addEventListener("grip-force-cart", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("grip-force-cart", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return state;
}

/** Cart count only, used by the header icon. Starts empty during SSR. */
export function useCartCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const refresh = () => setCount(compute(readRaw()).count);
    refresh();
    window.addEventListener("grip-force-cart", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("grip-force-cart", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return count;
}

export function cartItemImage(item: CartLine): string {
  return productImage(item.product);
}
