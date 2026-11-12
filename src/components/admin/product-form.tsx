import { useState, type ChangeEvent, type FormEvent } from "react";
import { uploadProductImage } from "@/lib/product-images";
import { COLLECTIONS } from "@/lib/catalog";
import {
  PRODUCT_STATUSES,
  formToPayload,
  slugify,
  type ProductFormValues,
  type ProductInsert,
} from "@/lib/admin-products";

const inputClass =
  "w-full rounded-md border border-input bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

type Props = {
  initial: ProductFormValues;
  submitLabel: string;
  /** Return an error message, or null when saved. */
  onSubmit: (payload: ProductInsert) => Promise<string | null>;
  /** Slug of an existing product: editing the slug breaks old links, so we warn. */
  existingSlug?: string;
};

export function ProductForm({ initial, submitLabel, onSubmit, existingSlug }: Props) {
  const [v, setV] = useState<ProductFormValues>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(existingSlug));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setSaved(false);
    setV((prev) => ({ ...prev, [key]: value }));
  };

  /** Upload picked files, then put the links into the form. */
  const upload = async (e: ChangeEvent<HTMLInputElement>, target: "main" | "gallery") => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of target === "main" ? files.slice(0, 1) : files) {
        urls.push(await uploadProductImage(file, v.slug || slugify(v.name)));
      }
      if (target === "main") set("imageUrl", urls[0] ?? "");
      else set("galleryText", [v.galleryText.trim(), ...urls].filter(Boolean).join("\n"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const result = formToPayload(v);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setBusy(true);
    const message = await onSubmit(result.payload);
    setBusy(false);
    if (message) setError(message);
    else setSaved(true);
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <Field label="Product name">
          <input
            className={inputClass}
            value={v.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            required
          />
        </Field>
        <Field
          label="Slug (web address)"
          hint={
            existingSlug && v.slug !== existingSlug
              ? "Warning: changing the slug breaks old links to this product."
              : "Small letters, numbers and dashes. Example: pro-hand-gripper"
          }
        >
          <input
            className={inputClass}
            value={v.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />
        </Field>
        <Field label="Collection">
          <select className={inputClass} value={v.collectionHandle} onChange={(e) => set("collectionHandle", e.target.value)}>
            {COLLECTIONS.map((c) => (
              <option key={c.handle} value={c.handle}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price (USD)">
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={v.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </Field>
        <Field label="Status" hint="Only “published” products show on the public site.">
          <select className={inputClass} value={v.status} onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sort order" hint="Smaller number shows first.">
          <input
            className={inputClass}
            type="number"
            step="1"
            value={v.sortOrder}
            onChange={(e) => set("sortOrder", e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.isNew} onChange={(e) => set("isNew", e.target.checked)} /> Mark as New
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /> Featured on home page
          </label>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5">
        <Field label="Description">
          <textarea className={inputClass} rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Features" hint="One feature on each line.">
          <textarea className={inputClass} rows={4} value={v.featuresText} onChange={(e) => set("featuresText", e.target.value)} />
        </Field>
        <Field label="Sizes" hint="Separate with commas. Example: S, M, L, XL. Leave empty if the product has no sizes.">
          <input className={inputClass} value={v.sizesText} onChange={(e) => set("sizesText", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5">
        <Field label="Main image URL" hint="Paste a link, or upload a file below (JPG, PNG or WebP, up to 5 MB).">
          <input className={inputClass} value={v.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} />
        </Field>
        <label className="text-sm">
          <span className="btn-outline-dark inline-block cursor-pointer">{uploading ? "Uploading…" : "Upload main image"}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(e) => upload(e, "main")} />
        </label>
        {v.imageUrl.trim() && (
          <img
            src={v.imageUrl.trim()}
            alt="Preview of the main product image"
            className="h-40 w-40 rounded-lg border border-border object-cover"
          />
        )}
        <Field label="Gallery image URLs" hint="One link on each line.">
          <textarea className={inputClass} rows={3} value={v.galleryText} onChange={(e) => set("galleryText", e.target.value)} />
        </Field>
        <label className="text-sm">
          <span className="btn-outline-dark inline-block cursor-pointer">{uploading ? "Uploading…" : "Upload gallery images"}</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(e) => upload(e, "gallery")} />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-sm text-primary">
          Saved.
        </p>
      )}

      <div>
        <button type="submit" disabled={busy || uploading} className="btn-neon disabled:opacity-60">
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
