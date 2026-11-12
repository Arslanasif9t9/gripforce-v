import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AdminField, ErrorBox, StatusBadge, adminInputClass } from "@/components/admin/ui";
import { formatDateTime, fromLocalInput, isSafeLink, toLocalInput } from "@/lib/admin-utils";
import { dbErrorMessage } from "@/lib/admin-products";

export const Route = createFileRoute("/admin/banners")({
  component: BannersPage,
});

type Banner = Database["public"]["Tables"]["promo_banners"]["Row"];
type BannerInsert = Database["public"]["Tables"]["promo_banners"]["Insert"];

type Form = {
  title: string;
  body: string;
  imageUrl: string;
  href: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  sortOrder: string;
};

const EMPTY: Form = { title: "", body: "", imageUrl: "", href: "", active: false, startsAt: "", endsAt: "", sortOrder: "0" };

function toForm(b: Banner): Form {
  return {
    title: b.title,
    body: b.body,
    imageUrl: b.image_url ?? "",
    href: b.href ?? "",
    active: b.active,
    startsAt: toLocalInput(b.starts_at),
    endsAt: toLocalInput(b.ends_at),
    sortOrder: String(b.sort_order),
  };
}

function toPayload(f: Form): { error: string } | { payload: BannerInsert } {
  const title = f.title.trim();
  if (!title) return { error: "Title is required." };
  if (title.length > 120) return { error: "Title is too long (max 120 characters)." };
  const href = f.href.trim();
  if (href && !isSafeLink(href)) return { error: "Link must start with / (a page of this site) or https://" };
  const imageUrl = f.imageUrl.trim();
  if (imageUrl && !isSafeLink(imageUrl)) return { error: "Image link must start with / or https://" };
  const sortOrder = Number.parseInt(f.sortOrder, 10);
  if (!Number.isFinite(sortOrder)) return { error: "Sort order must be a whole number." };
  const startsAt = fromLocalInput(f.startsAt);
  const endsAt = fromLocalInput(f.endsAt);
  if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) return { error: "End date must be after the start date." };
  return {
    payload: {
      title,
      body: f.body.trim(),
      image_url: imageUrl || null,
      href: href || null,
      active: f.active,
      starts_at: startsAt,
      ends_at: endsAt,
      sort_order: sortOrder,
    },
  };
}

function BannersPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<{ id: string | null; form: Form } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const banners = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async (): Promise<Banner[]> => {
      const { data, error: err } = await supabase
        .from("promo_banners")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (err) throw err;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-banners"] });
    qc.invalidateQueries({ queryKey: ["admin-count", "promo_banners"] });
    qc.invalidateQueries({ queryKey: ["promo-banner"] });
  };

  const save = useMutation({
    mutationFn: async ({ id, payload }: { id: string | null; payload: BannerInsert }) => {
      const { error: err } = id
        ? await supabase.from("promo_banners").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id)
        : await supabase.from("promo_banners").insert(payload);
      if (err) throw err;
    },
    onSuccess: () => {
      setEditing(null);
      setError(null);
      refresh();
    },
    onError: (e: { code?: string; message: string }) => setError(dbErrorMessage(e)),
  });

  const toggle = useMutation({
    mutationFn: async (b: Banner) => {
      const { error: err } = await supabase
        .from("promo_banners")
        .update({ active: !b.active, updated_at: new Date().toISOString() })
        .eq("id", b.id);
      if (err) throw err;
    },
    onSuccess: refresh,
    onError: (e: { code?: string; message: string }) => setError(dbErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("promo_banners").delete().eq("id", id);
      if (err) throw err;
    },
    onSuccess: refresh,
    onError: (e: { code?: string; message: string }) => setError(dbErrorMessage(e)),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const result = toPayload(editing.form);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    save.mutate({ id: editing.id, payload: result.payload });
  };

  const setField = <K extends keyof Form>(key: K, value: Form[K]) =>
    setEditing((prev) => (prev ? { ...prev, form: { ...prev.form, [key]: value } } : prev));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading-section">Banners</h1>
        {!editing && (
          <button className="btn-neon" onClick={() => { setError(null); setEditing({ id: null, form: EMPTY }); }}>
            Add banner
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        The first active banner (smallest sort order, inside its dates) replaces the green message at the top of the website.
      </p>

      {error && <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>}

      {editing && (
        <form onSubmit={submit} className="mt-5 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
          <h2 className="font-display text-xl uppercase tracking-wide sm:col-span-2">
            {editing.id ? "Edit banner" : "New banner"}
          </h2>
          <div className="sm:col-span-2">
            <AdminField label="Title (shown at the top of the site)">
              <input className={adminInputClass} value={editing.form.title} onChange={(e) => setField("title", e.target.value)} maxLength={120} required />
            </AdminField>
          </div>
          <div className="sm:col-span-2">
            <AdminField label="Details (optional, for your own notes)">
              <textarea className={adminInputClass} rows={2} value={editing.form.body} onChange={(e) => setField("body", e.target.value)} />
            </AdminField>
          </div>
          <AdminField label="Link (optional)" hint="Example: /shop or https://…">
            <input className={adminInputClass} value={editing.form.href} onChange={(e) => setField("href", e.target.value)} />
          </AdminField>
          <AdminField label="Image link (optional)">
            <input className={adminInputClass} value={editing.form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} />
          </AdminField>
          <AdminField label="Starts at" hint="Empty = starts now.">
            <input className={adminInputClass} type="datetime-local" value={editing.form.startsAt} onChange={(e) => setField("startsAt", e.target.value)} />
          </AdminField>
          <AdminField label="Ends at" hint="Empty = no end.">
            <input className={adminInputClass} type="datetime-local" value={editing.form.endsAt} onChange={(e) => setField("endsAt", e.target.value)} />
          </AdminField>
          <AdminField label="Sort order" hint="Smaller number wins.">
            <input className={adminInputClass} type="number" step="1" value={editing.form.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} />
          </AdminField>
          <label className="flex items-center gap-2 self-end text-sm">
            <input type="checkbox" checked={editing.form.active} onChange={(e) => setField("active", e.target.checked)} /> Active
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={save.isPending} className="btn-neon disabled:opacity-60">
              {save.isPending ? "Saving…" : "Save banner"}
            </button>
            <button type="button" className="btn-outline-dark" onClick={() => { setEditing(null); setError(null); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {banners.isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {banners.isError && <p className="mt-6 text-sm text-destructive">Could not load banners.</p>}
      {banners.data && banners.data.length === 0 && !editing && (
        <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">No banners yet.</p>
      )}

      {banners.data && banners.data.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Dates</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.data.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    <p className="font-medium">{b.title}</p>
                    {b.href && <p className="text-xs text-muted-foreground">{b.href}</p>}
                  </td>
                  <td className="px-3 py-2">{b.sort_order}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {formatDateTime(b.starts_at)} → {formatDateTime(b.ends_at)}
                  </td>
                  <td className="px-3 py-2"><StatusBadge on={b.active} /></td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button className="text-primary underline" onClick={() => { setError(null); setEditing({ id: b.id, form: toForm(b) }); }}>
                        Edit
                      </button>
                      <button className="underline" disabled={toggle.isPending} onClick={() => toggle.mutate(b)}>
                        {b.active ? "Turn off" : "Turn on"}
                      </button>
                      <button
                        className="text-destructive underline"
                        disabled={remove.isPending}
                        onClick={() => { if (window.confirm(`Delete banner “${b.title}”?`)) remove.mutate(b.id); }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
