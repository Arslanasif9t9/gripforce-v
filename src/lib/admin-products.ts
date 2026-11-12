import { COLLECTIONS } from "@/lib/catalog";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/** Form values are strings so inputs stay simple. */
export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  featuresText: string; // one feature per line
  collectionHandle: string;
  price: string;
  imageUrl: string;
  galleryText: string; // one URL per line
  sizesText: string; // comma separated, empty = no sizes
  isNew: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  sortOrder: string;
};

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  featuresText: "",
  collectionHandle: COLLECTIONS[0]?.handle ?? "",
  price: "0",
  imageUrl: "",
  galleryText: "",
  sizesText: "",
  isNew: false,
  isFeatured: false,
  status: "draft",
  sortOrder: "0",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function rowToForm(row: ProductRow): ProductFormValues {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description,
    featuresText: row.features.join("\n"),
    collectionHandle: row.collection_handle,
    price: String(row.price),
    imageUrl: row.image_url,
    galleryText: row.gallery.join("\n"),
    sizesText: (row.sizes ?? []).join(", "),
    isNew: row.is_new,
    isFeatured: row.is_featured,
    status: (PRODUCT_STATUSES as readonly string[]).includes(row.status) ? (row.status as ProductStatus) : "draft",
    sortOrder: String(row.sort_order),
  };
}

/** Returns an error message, or the clean payload for the database. */
export function formToPayload(v: ProductFormValues): { error: string } | { payload: ProductInsert } {
  const name = v.name.trim();
  if (!name) return { error: "Product name is required." };

  const slug = slugify(v.slug || name);
  if (!slug) return { error: "Slug is required (letters, numbers and dashes)." };

  const price = Number(v.price);
  if (!Number.isFinite(price) || price < 0) return { error: "Price must be 0 or more." };

  const sortOrder = Number.parseInt(v.sortOrder, 10);
  if (!Number.isFinite(sortOrder)) return { error: "Sort order must be a whole number." };

  const collection = COLLECTIONS.find((c) => c.handle === v.collectionHandle);
  if (!collection) return { error: "Choose a collection." };

  const sizes = v.sizesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    payload: {
      name,
      slug,
      description: v.description.trim(),
      features: lines(v.featuresText),
      collection_handle: collection.handle,
      collection_name: collection.name,
      price: Math.round(price * 100) / 100,
      image_url: v.imageUrl.trim(),
      gallery: lines(v.galleryText),
      sizes: sizes.length ? sizes : null,
      is_new: v.isNew,
      is_featured: v.isFeatured,
      status: v.status,
      sort_order: sortOrder,
    },
  };
}

/** Friendly text for common database errors. */
export function dbErrorMessage(err: { code?: string; message: string }): string {
  if (err.code === "23505") return "This slug is already used by another product. Change the slug.";
  if (err.code === "42501") return "You do not have permission. Sign in with the owner account.";
  return err.message;
}
