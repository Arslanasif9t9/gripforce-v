import {
  PRODUCT_IMAGES,
  PRODUCTS,
  type Product,
  type ProductImageKey,
} from "./catalog-data";

export type Collection = {
  handle: string;
  name: string;
  description: string;
  image: string;
};

/** Main storefront collections, in navigation order. */
export const COLLECTIONS: Collection[] = [
  {
    handle: "hand-grip",
    name: "Hand & Grip",
    description: "Adjustable grippers and finger trainers to build serious grip strength.",
    image: PRODUCT_IMAGES["hand-gripper"],
  },
  {
    handle: "strength-training",
    name: "Strength Training",
    description: "Belts, wraps, straps, dumbbells and kettlebells for heavy sessions.",
    image: PRODUCT_IMAGES["weightlifting-belt"],
  },
  {
    handle: "gym-gloves",
    name: "Gym Gloves",
    description: "Padded, breathable gloves that protect your palms through every set.",
    image: PRODUCT_IMAGES["gym-gloves"],
  },
  {
    handle: "home-workout",
    name: "Home Workout",
    description: "Push-up bars, ab rollers, jump ropes and mats for training at home.",
    image: PRODUCT_IMAGES["push-up-bars"],
  },
  {
    handle: "resistance-bands",
    name: "Resistance Bands",
    description: "A complete band set for strength, mobility and warm-ups.",
    image: PRODUCT_IMAGES["resistance-bands"],
  },
  {
    handle: "gym-bags",
    name: "Gym Bags",
    description: "Duffels that keep your kit organized and ready to go.",
    image: PRODUCT_IMAGES["duffel-bag"],
  },
  {
    handle: "hydration",
    name: "Bottles & Hydration",
    description: "Insulated bottles and shakers built for gym, work and travel.",
    image: PRODUCT_IMAGES["insulated-bottle"],
  },
  {
    handle: "recovery-mobility",
    name: "Recovery & Mobility",
    description: "Foam rollers and massage tools for faster recovery.",
    image: PRODUCT_IMAGES["foam-roller"],
  },
  {
    handle: "bundles",
    name: "Bundles & Offers",
    description: "Curated accessory kits at a better price than buying separately.",
    image: PRODUCT_IMAGES["starter-kit"],
  },
];

export function getCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}

export function productsByCollection(handle: string): Product[] {
  return PRODUCTS.filter((p) => p.collection === handle);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function newProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.collection === product.collection && p.slug !== product.slug);
  if (same.length >= count) return same.slice(0, count);
  const others = PRODUCTS.filter((p) => p.collection !== product.collection && p.slug !== product.slug);
  return [...same, ...others].slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return PRODUCTS.filter((p) => {
    const haystack = `${p.name} ${p.collectionName} ${p.description} ${p.features.join(" ")}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export function productImage(product: Pick<Product, "image">): string {
  return product.image;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function productPath(product: Pick<Product, "slug">): string {
  return `/product/${product.slug}`;
}

export { PRODUCTS, PRODUCT_IMAGES };
export type { Product, ProductImageKey };
