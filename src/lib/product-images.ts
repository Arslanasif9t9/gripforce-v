import { supabase } from "@/integrations/supabase/client";

export const IMAGE_BUCKET = "product-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Uploads one image to Storage and returns its public link. Throws an Error with a friendly message. */
export async function uploadProductImage(file: File, slugHint: string): Promise<string> {
  const ext = TYPES[file.type];
  if (!ext) throw new Error(`“${file.name}”: only JPG, PNG or WebP images are allowed.`);
  if (file.size > MAX_IMAGE_BYTES) throw new Error(`“${file.name}” is bigger than 5 MB.`);

  const folder = slugHint.replace(/[^a-z0-9-]/g, "") || "new";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    if (/bucket/i.test(error.message) && /not found/i.test(error.message)) {
      throw new Error("Image storage is not set up yet. Run migration 0002_product_images_storage.sql in Lovable.");
    }
    throw new Error(error.message);
  }
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
