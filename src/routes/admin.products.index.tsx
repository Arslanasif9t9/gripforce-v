import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_STATUSES, dbErrorMessage, type ProductRow } from "@/lib/admin-products";
import { buildShopifyCsv, downloadCsv } from "@/lib/shopify-csv";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsList,
});

const badge: Record<string, string> = {
  published: "bg-primary/15 text-primary",
  draft: "bg-secondary text-muted-foreground",
  archived: "bg-destructive/15 text-destructive",
};

function ProductsList() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [message, setMessage] = useState<string | null>(null);

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["admin-count", "products"] });
    qc.invalidateQueries({ queryKey: ["catalog"] });
  };

  const setProductStatus = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage(null);
      refresh();
    },
    onError: (e: { code?: string; message: string }) => setMessage(dbErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage(null);
      refresh();
    },
    onError: (e: { code?: string; message: string }) => setMessage(dbErrorMessage(e)),
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products.data ?? []).filter(
      (p) =>
        (status === "all" || p.status === status) &&
        (!q || p.name.toLowerCase().includes(q) || p.slug.includes(q) || p.collection_name.toLowerCase().includes(q)),
    );
  }, [products.data, search, status]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading-section">Products</h1>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn-outline-dark"
            disabled={!products.data || products.data.length === 0}
            title="Download all products as a Shopify import file"
            onClick={() => products.data && downloadCsv("grip-force-shopify-products.csv", buildShopifyCsv(products.data, window.location.origin))}
          >
            Export Shopify CSV
          </button>
          <Link to="/admin/products/new" className="btn-neon">
            Add product
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, slug, collection…"
          aria-label="Search products"
          className="min-w-0 flex-1 rounded-md border border-input bg-surface-2 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="rounded-md border border-input bg-surface-2 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {PRODUCT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {message}
        </p>
      )}

      {products.isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {products.isError && (
        <p className="mt-6 text-sm text-destructive">Could not load products. Check that you are signed in as the owner.</p>
      )}
      {products.data && products.data.length === 0 && (
        <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          No products in the database yet. Run <code>drizzle/seeds/001_seed_products.sql</code> in the Lovable SQL editor to
          import the 17 starter products, or click “Add product”.
        </p>
      )}

      {rows.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Collection</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="size-10 rounded-md border border-border object-cover" />
                      ) : (
                        <span className="size-10 rounded-md border border-border bg-secondary" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">{p.collection_name}</td>
                  <td className="px-3 py-2">PKR {Number(p.price).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${badge[p.status] ?? badge["draft"]}`}>{p.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link to="/admin/products/$id" params={{ id: p.id }} className="text-primary underline">
                        Edit
                      </Link>
                      <button
                        className="underline"
                        disabled={setProductStatus.isPending}
                        onClick={() =>
                          setProductStatus.mutate({ id: p.id, next: p.status === "published" ? "draft" : "published" })
                        }
                      >
                        {p.status === "published" ? "Hide" : "Publish"}
                      </button>
                      <button
                        className="text-destructive underline"
                        disabled={remove.isPending}
                        onClick={() => {
                          if (window.confirm(`Delete “${p.name}” forever? This cannot be undone.`)) remove.mutate(p.id);
                        }}
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
      {products.data && products.data.length > 0 && rows.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No product matches your search.</p>
      )}
    </div>
  );
}
