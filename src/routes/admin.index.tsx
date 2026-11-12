import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type CountTable = "products" | "orders" | "coupons" | "promo_banners" | "support_messages";

async function countRows(table: CountTable): Promise<number> {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

const CARDS: { table: CountTable; label: string }[] = [
  { table: "products", label: "Products" },
  { table: "orders", label: "Orders" },
  { table: "coupons", label: "Coupons" },
  { table: "promo_banners", label: "Banners" },
  { table: "support_messages", label: "Support messages" },
];

function StatCard({ table, label }: { table: CountTable; label: string }) {
  const q = useQuery({ queryKey: ["admin-count", table], queryFn: () => countRows(table) });
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl text-primary">
        {q.isLoading ? "…" : q.isError ? "!" : q.data}
      </p>
      {q.isError && <p className="mt-1 text-xs text-destructive">Could not load</p>}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h1 className="heading-section">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Live counts from the database. Management pages for each section come next.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <StatCard key={c.table} {...c} />
        ))}
      </div>
    </div>
  );
}
