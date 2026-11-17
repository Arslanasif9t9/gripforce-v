import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Grip Force" },
      { name: "description", content: "Track your Grip Force order with your order number." },
      { property: "og:title", content: "Track Your Order — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const cleanNumber = orderQuery.trim().toUpperCase().replace(/^#/, "");
    if (!cleanNumber) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setOrder(null);
    setItems([]);

    try {
      // Secure RPC call jo direct database table expose nahi karti
      const { data, error: rpcErr } = await supabase
        .rpc("get_order_status", { p_order_number: cleanNumber });

      if (rpcErr) throw rpcErr;

      if (!data) {
        setError(`No order found matching "${cleanNumber}". Please check the number in your receipt.`);
        return;
      }

      setOrder(data);
      setItems(data.items || []);
    } catch (err: any) {
      console.error("Track failed:", err);
      setError("Unable to retrieve order details. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "shipped", label: "Shipped / On The Way", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Package },
  ];

  function getStepIndex(status: string) {
    switch (status) {
      case "pending": return 0;
      case "confirmed":
      case "processing": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      default: return 0;
    }
  }

  const activeIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="container-page max-w-3xl py-16">
      <div className="text-center">
        <h1 className="heading-section">Track Your Order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your Grip Force order reference (e.g. GF-123456) to check its current status.
        </p>

        {/* Search Box */}
        <form onSubmit={handleTrack} className="mx-auto mt-8 flex max-w-md gap-2">
          <input
            type="text"
            required
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="e.g. GF-123456"
            className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button type="submit" disabled={loading} className="btn-neon px-6 py-3">
            {loading ? "Searching..." : <Search className="h-5 w-5" />}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Details Display */}
      {order && (
        <div className="mt-10 space-y-6">
          {/* Status Tracker */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Order</span>
                <div className="font-mono text-xl font-bold text-primary">#{order.order_number}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Status</span>
                <div className="capitalize font-semibold text-foreground">{order.status}</div>
              </div>
              {order.tracking_number && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Courier Tracking</span>
                  <div className="font-mono text-sm font-semibold text-foreground">{order.tracking_number}</div>
                </div>
              )}
            </div>

            {/* Stepper */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="text-center">
                    <div
                      className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                        isCurrent
                          ? "border-primary bg-primary text-black shadow-[0_0_20px_rgba(163,255,18,0.5)]"
                          : isPassed
                          ? "border-primary/60 bg-primary/20 text-primary"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className={`mt-2 text-xs font-medium ${isPassed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-foreground">Items in this shipment</h2>
            <ul className="mt-4 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium text-foreground">{item.product_name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right font-medium text-foreground">
                    {formatPrice(item.line_total)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
