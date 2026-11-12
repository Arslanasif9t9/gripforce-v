import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PRODUCTS, type Product } from "./catalog";

/**
 * Where the shop gets its products.
 * 1. Database table `products` (only `published` rows, public by RLS).
 * 2. If the database has no published products, or cannot be reached, the
 *    built-in list in `catalog-data.ts` is used. The shop never shows an empty page.
 */
type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    features: row.features ?? [],
    collection: row.collection_handle,
    collectionName: row.collection_name,
    price: Number(row.price),
    image: row.image_url,
    gallery: row.gallery ?? [],
    sizes: row.sizes && row.sizes.length > 0 ? row.sizes : null,
    isNew: row.is_new,
    isFeatured: row.is_featured,
  };
}

export async function fetchCatalog(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return PRODUCTS;
    return data.map(rowToProduct);
  } catch {
    return PRODUCTS;
  }
}

/** The list the cart uses to find products by slug. Updated by `useCatalog`. */
let activeCatalog: Product[] = PRODUCTS;

export function findActiveProduct(slug: string): Product | undefined {
  return activeCatalog.find((p) => p.slug === slug);
}

export const CATALOG_QUERY_KEY = ["catalog"] as const;

/**
 * Products for the public shop. Starts with the built-in list (so server render
 * and first paint are never empty), then swaps to the database list.
 */
export function useCatalog(): Product[] {
  const query = useQuery({
    queryKey: CATALOG_QUERY_KEY,
    queryFn: fetchCatalog,
    placeholderData: PRODUCTS,
    staleTime: 60_000,
  });
  const products = query.data ?? PRODUCTS;

  useEffect(() => {
    if (activeCatalog === products) return;
    activeCatalog = products;
    // Tell the cart to recalculate with the new product list.
    window.dispatchEvent(new Event("grip-force-cart"));
  }, [products]);

  return products;
}
