import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActiveBanner = { title: string; href: string | null };

/** First active banner that is inside its date window, or null. Used by the header. */
export async function fetchActiveBanner(): Promise<ActiveBanner | null> {
  try {
    const { data, error } = await supabase
      .from("promo_banners")
      .select("title, href, starts_at, ends_at")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return null;
    const now = Date.now();
    const live = data.find(
      (b) =>
        (!b.starts_at || new Date(b.starts_at).getTime() <= now) &&
        (!b.ends_at || new Date(b.ends_at).getTime() >= now),
    );
    return live ? { title: live.title, href: live.href } : null;
  } catch {
    return null;
  }
}

export function useActiveBanner(): ActiveBanner | null {
  const q = useQuery({ queryKey: ["promo-banner"], queryFn: fetchActiveBanner, staleTime: 60_000 });
  return q.data ?? null;
}
