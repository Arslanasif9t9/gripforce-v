import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AdminField, ErrorBox, StatusBadge, adminInputClass } from "@/components/admin/ui";
import { formatDateTime, fromLocalInput, toLocalInput } from "@/lib/admin-utils";
import { dbErrorMessage } from "@/lib/admin-products";

export const Route = createFileRoute("/admin/coupons")({
  component: CouponsPage,
});

type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
type CouponInsert = Database["public"]["Tables"]["coupons"]["Insert"];

type Form = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  active: boolean;
  startsAt: string;
  expiresAt: string;
  usageLimit: string;
};

const EMPTY: Form = {
  code: "",
  discountType: "percentage",
  discountValue: "10",
  active: false,
  startsAt: "",
  expiresAt: "",
  usageLimit: "",
};

function toForm(c: Coupon): Form {
  return {
    code: c.code,
    discountType: c.discount_type === "fixed" ? "fixed" : "percentage",
    discountValue: String(c.discount_value),
    active: c.active,
    startsAt: toLocalInput(c.starts_at),
    expiresAt: toLocalInput(c.expires_at),
    usageLimit: c.usage_limit == null ? "" : String(c.usage_limit),
  };
}

function toPayload(f: Form): { error: string } | { payload: CouponInsert } {
  const code = f.code.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) return { error: "Code: 3 to 32 letters, numbers, dash or underscore." };
  const value = Number(f.discountValue);
  if (!Number.isFinite(value) || value <= 0) return { error: "Discount value must be more than 0." };
  if (f.discountType === "percentage" && value > 100) return { error: "A percentage discount cannot be more than 100." };
  let usageLimit: number | null = null;
  if (f.usageLimit.trim()) {
    usageLimit = Number.parseInt(f.usageLimit, 10);
    if (!Number.isFinite(usageLimit) || usageLimit <= 0) return { error: "Usage limit must be a whole number above 0, or empty." };
  }
  const startsAt = fromLocalInput(f.startsAt);
  const expiresAt = fromLocalInput(f.expiresAt);
  if (startsAt && expiresAt && new Date(expiresAt) <= new Date(startsAt)) return { error: "Expiry must be after the start date." };
  return {
    payload: {
      code,
      discount_type: f.discountType,
      discount_value: Math.round(value * 100) / 100,
      active: f.active,
      starts_at: startsAt,
      expires_at: expiresAt,
      usage_limit: usageLimit,
    },
  };
}

function CouponsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<{ id: string | null; form: Form } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const coupons = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async (): Promise<Coupon[]> => {
      const { data, error: err } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (err) throw err;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    qc.invalidateQueries({ queryKey: ["admin-count", "coupons"] });
  };

  const save = useMutation({
    mutationFn: async ({ id, payload }: { id: string | null; payload: CouponInsert }) => {
      const { error: err } = id
        ? await supabase.from("coupons").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id)
        : await supabase.from("coupons").insert(payload);
      if (err) throw err;
    },
    onSuccess: () => {
      setEditing(null);
      setError(null);
      refresh();
    },
    onError: (e: { code?: string; message: string }) =>
      setError(e.code === "23505" ? "This coupon code already exists." : dbErrorMessage(e)),
  });

  const toggle = useMutation({
    mutationFn: async (c: Coupon) => {
      const { error: err } = await supabase
        .from("coupons")
        .update({ active: !c.active, updated_at: new Date().toISOString() })
        .eq("id", c.id);
      if (err) throw err;
    },
    onSuccess: refresh,
    onError: (e: { code?: string; message: string }) => setError(dbErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("coupons").delete().eq("id", id);
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
        <h1 className="heading-section">Coupons</h1>
        {!editing && (
          <button className="btn-neon" onClick={() => { setError(null); setEditing({ id: null, form: EMPTY }); }}>
            Add coupon
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Coupons are saved here. They will be applied at checkout when the order system is built.
      </p>

      {error && <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>}

      {editing && (
        <form onSubmit={submit} className="mt-5 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
          <h2 className="font-display text-xl uppercase tracking-wide sm:col-span-2">
            {editing.id ? "Edit coupon" : "New coupon"}
          </h2>
          <AdminField label="Code" hint="Saved in capital letters. Example: WELCOME10">
            <input className={adminInputClass} value={editing.form.code} onChange={(e) => setField("code", e.target.value)} required />
          </AdminField>
          <AdminField label="Discount type">
            <select
              className={adminInputClass}
              value={editing.form.discountType}
              onChange={(e) => setField("discountType", e.target.value as Form["discountType"])}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount (PKR)</option>
            </select>
          </AdminField>
          <AdminField label="Discount value">
            <input
              className={adminInputClass}
              type="number"
              min="0.01"
              step="0.01"
              value={editing.form.discountValue}
              onChange={(e) => setField("discountValue", e.target.value)}
            />
          </AdminField>
          <AdminField label="Usage limit" hint="Empty = unlimited.">
            <input
              className={adminInputClass}
              type="number"
              min="1"
              step="1"
              value={editing.form.usageLimit}
              onChange={(e) => setField("usageLimit", e.target.value)}
            />
          </AdminField>
          <AdminField label="Starts at" hint="Empty = starts now.">
            <input className={adminInputClass} type="datetime-local" value={editing.form.startsAt} onChange={(e) => setField("startsAt", e.target.value)} />
          </AdminField>
          <AdminField label="Expires at" hint="Empty = never expires.">
            <input className={adminInputClass} type="datetime-local" value={editing.form.expiresAt} onChange={(e) => setField("expiresAt", e.target.value)} />
          </AdminField>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={editing.form.active} onChange={(e) => setField("active", e.target.checked)} /> Active
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={save.isPending} className="btn-neon disabled:opacity-60">
              {save.isPending ? "Saving…" : "Save coupon"}
            </button>
            <button type="button" className="btn-outline-dark" onClick={() => { setEditing(null); setError(null); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {coupons.isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {coupons.isError && <p className="mt-6 text-sm text-destructive">Could not load coupons.</p>}
      {coupons.data && coupons.data.length === 0 && !editing && (
        <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">No coupons yet.</p>
      )}

      {coupons.data && coupons.data.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Discount</th>
                <th className="px-3 py-2">Used</th>
                <th className="px-3 py-2">Dates</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.data.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{c.code}</td>
                  <td className="px-3 py-2">
                    {c.discount_type === "percentage" ? `${Number(c.discount_value)}%` : `PKR ${Number(c.discount_value).toLocaleString()}`}
                  </td>
                  <td className="px-3 py-2">
                    {c.usage_count}
                    {c.usage_limit ? ` / ${c.usage_limit}` : ""}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {formatDateTime(c.starts_at)} → {formatDateTime(c.expires_at)}
                  </td>
                  <td className="px-3 py-2"><StatusBadge on={c.active} /></td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button className="text-primary underline" onClick={() => { setError(null); setEditing({ id: c.id, form: toForm(c) }); }}>
                        Edit
                      </button>
                      <button className="underline" disabled={toggle.isPending} onClick={() => toggle.mutate(c)}>
                        {c.active ? "Turn off" : "Turn on"}
                      </button>
                      <button
                        className="text-destructive underline"
                        disabled={remove.isPending}
                        onClick={() => { if (window.confirm(`Delete coupon ${c.code}?`)) remove.mutate(c.id); }}
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
