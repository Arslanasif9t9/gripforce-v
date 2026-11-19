import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Grip Force" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

interface CustomerOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  tracking_number?: string | null;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  confirmed: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  processing: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  shipped: "bg-indigo-400/10 text-indigo-400 border-indigo-400/30",
  delivered: "bg-primary/10 text-primary border-primary/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

function AccountPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, order_number, status, total, created_at, tracking_number")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setOrders(data as CustomerOrder[]);
        }
      } catch (err) {
        console.error("Error loading account orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="container-page py-16 text-center text-muted-foreground">
        Loading account…
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="badge-neon mb-2 inline-block">Customer Account</span>
          <h1 className="heading-section">{user.email}</h1>
          <p className="mt-1 text-xs text-muted-foreground">Manage your orders and account settings.</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="btn-outline-dark text-xs py-2 px-4">
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="font-display text-xl uppercase tracking-wider text-foreground">
          My Orders
        </h2>

        {loadingOrders ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
            <Link to="/shop" className="btn-neon mt-4 inline-block text-xs">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-border/80"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-base tracking-wider text-foreground">
                      #{ord.order_number}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                        STATUS_BADGE[ord.status] || "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Placed on {new Date(ord.created_at).toLocaleDateString()} • Total: {formatPrice(Number(ord.total))}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/track"
                    className="btn-outline-dark text-xs py-2 px-4"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
