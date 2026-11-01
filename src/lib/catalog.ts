import { PLACEHOLDER_IMAGES, PRODUCTS, type PlaceholderImageKey, type Product } from "./catalog-data";

export type Collection = {
  handle: string;
  name: string;
  description: string;
  image: PlaceholderImageKey;
};

/** Main storefront collections, in navigation order. */
export const COLLECTIONS: Collection[] = [
  {
    handle: "hand-grip",
    name: "Hand & Grip",
    description: "Grippers, finger trainers and forearm tools to build serious grip strength.",
    image: "grip",
  },
  {
    handle: "gym-gloves",
    name: "Gym Gloves",
    description: "Padded, breathable gloves that protect your palms through every set.",
    image: "gloves",
  },
  {
    handle: "strength-training",
    name: "Strength Training",
    description: "Straps, wraps, belts, sleeves and free weights for heavy sessions.",
    image: "grip",
  },
  {
    handle: "home-workout",
    name: "Home Workout",
    description: "Compact equipment for effective training without leaving home.",
    image: "roller",
  },
  {
    handle: "resistance-bands",
    name: "Resistance Bands",
    description: "Loop, tube and fabric bands for strength, mobility and warm-ups.",
    image: "bands",
  },
  {
    handle: "gym-bags",
    name: "Gym Bags & Essentials",
    description: "Duffels, backpacks and small essentials that keep your kit organized.",
    image: "bag",
  },
  {
    handle: "hydration",
    name: "Bottles & Hydration",
    description: "Shakers and insulated bottles built for gym, work and travel.",
    image: "bottle",
  },
  {
    handle: "recovery-mobility",
    name: "Recovery & Mobility",
    description: "Foam rollers, massage tools and stretch gear for faster recovery.",
    image: "roller",
  },
  {
    handle: "yoga-flexibility",
    name: "Yoga & Flexibility",
    description: "Mats, blocks and straps for yoga, pilates and stretching routines.",
    image: "roller",
  },
  {
    handle: "gym-wear",
    name: "Gym Wear",
    description: "Training tops, shorts, sweatbands and wearable gym accessories.",
    image: "gloves",
  },
  {
    handle: "bundles",
    name: "Bundles & Offers",
    description: "Curated accessory kits at a better price than buying separately.",
    image: "bands",
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
    const haystack = `${p.name} ${p.collectionName} ${p.description}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export function productImage(product: Pick<Product, "image">): string {
  return PLACEHOLDER_IMAGES[product.image];
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function productPath(product: Pick<Product, "slug">): string {
  return `/product/${product.slug}`;
}

export { PRODUCTS, PLACEHOLDER_IMAGES };
export type { Product, PlaceholderImageKey };
