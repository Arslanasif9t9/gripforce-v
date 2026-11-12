import type { ProductRow } from "@/lib/admin-products";

/**
 * Builds a Shopify product-import CSV from the database products.
 * Shopify admin: Products > Import. Image links must be public https links,
 * so relative links ("/...") get the website address in front.
 */
const HEADERS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Grams", "Variant Inventory Tracker",
  "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping",
  "Variant Taxable", "Image Src", "Image Position", "Image Alt Text", "Gift Card", "SEO Title",
  "SEO Description", "Status",
] as const;

const esc = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;
const html = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function absolute(url: string, origin: string): string {
  if (!url) return "";
  return url.startsWith("/") ? `${origin}${url}` : url;
}

export function buildShopifyCsv(products: ProductRow[], origin: string): string {
  const lines: string[] = [HEADERS.map(esc).join(",")];

  for (const p of products) {
    const body =
      `<p>${html(p.description)}</p>` +
      (p.features.length ? `<ul>${p.features.map((f) => `<li>${html(f)}</li>`).join("")}</ul>` : "");
    const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : null;
    const variants = sizes ?? ["Default Title"];
    const images = [p.image_url, ...p.gallery.filter((g) => g !== p.image_url)]
      .filter(Boolean)
      .map((u) => absolute(u, origin));
    const status = p.status === "published" ? "active" : p.status === "archived" ? "archived" : "draft";
    const tags = [p.collection_name, p.is_new ? "new" : "", p.is_featured ? "featured" : ""].filter(Boolean).join(", ");

    const rowCount = Math.max(variants.length, images.length);
    for (let i = 0; i < rowCount; i++) {
      const variant = variants[i];
      const image = images[i];
      const first = i === 0;
      const row: Record<(typeof HEADERS)[number], string | number | boolean> = {
        "Handle": p.slug,
        "Title": first ? p.name : "",
        "Body (HTML)": first ? body : "",
        "Vendor": first ? "Grip Force" : "",
        "Product Category": "",
        "Type": first ? p.collection_name : "",
        "Tags": first ? tags : "",
        "Published": first ? p.status === "published" : "",
        "Option1 Name": variant ? (sizes ? "Size" : "Title") : "",
        "Option1 Value": variant ?? "",
        "Variant SKU": variant ? (sizes ? `${p.slug}-${variant}` : p.slug) : "",
        "Variant Grams": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Policy": variant ? "deny" : "",
        "Variant Fulfillment Service": variant ? "manual" : "",
        "Variant Price": variant ? Number(p.price).toFixed(2) : "",
        "Variant Requires Shipping": variant ? true : "",
        "Variant Taxable": variant ? true : "",
        "Image Src": image ?? "",
        "Image Position": image ? i + 1 : "",
        "Image Alt Text": image ? p.name : "",
        "Gift Card": first ? false : "",
        "SEO Title": first ? p.name : "",
        "SEO Description": first ? p.description.slice(0, 320) : "",
        "Status": first ? status : "",
      };
      lines.push(HEADERS.map((h) => esc(row[h])).join(","));
    }
  }
  return lines.join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
