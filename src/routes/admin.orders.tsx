import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ExternalLink 
} from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // 1. Fetch Orders with Items
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // 2. Mutation to update Order Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  // 3. Mutation to update Tracking Number
  const updateTrackingMutation = useMutation({
    mutationFn: async ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ tracking_number: trackingNumber, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  // Filter & Search Logic
  const filteredOrders = orders.filter((ord: any) => {
    const matchesStatus = filterStatus === "all" || ord.status === filterStatus;

    const method = ord.shipping_address?.payment_method ?? "";
    const matchesPayment =
      filterPayment === "all"
        ? true
        : filterPayment === "cod"
          ? method === "cod"
          : filterPayment === "bank"
            ? method === "bank_transfer"
            : filterPayment === "paid"
              ? method === "bank_transfer" && !!ord.receipt_url
              : /* unpaid */ method === "cod" || (method === "bank_transfer" && !ord.receipt_url);

    const matchesSearch =
      ord.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customer_phone && ord.customer_phone.includes(searchQuery));

    return matchesStatus && matchesPayment && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    confirmed: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    processing: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
    shipped: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    delivered: "border-primary/30 bg-primary/10 text-primary",
    cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="heading-section">Customer Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage incoming orders, update dispatch statuses and assign courier tracking numbers.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm">
          Total Orders: <span className="font-bold text-primary">{orders.length}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status chips */}
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filterStatus === st
                  ? "bg-primary text-black"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}

          {/* Divider */}
          <span className="mx-2 h-5 w-px bg-border" aria-hidden />

          {/* Payment method chips */}
          {[
            { key: "all", label: "All Payments" },
            { key: "cod", label: "COD" },
            { key: "bank", label: "Bank Transfer" },
            { key: "paid", label: "Paid (slip)" },
            { key: "unpaid", label: "Unpaid" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setFilterPayment(p.key)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filterPayment === p.key
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading orders from database...</div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load orders.
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-12 text-center text-muted-foreground">
          No orders found matching your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord: any) => {
            const isExpanded = expandedOrderId === ord.id;
            const address = ord.shipping_address || {};

            return (
              <div
                key={ord.id}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border/80"
              >
                {/* Header Row */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-mono font-bold text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-foreground">
                          #{ord.order_number}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            statusColors[ord.status] || "border-border text-foreground"
                          }`}
                        >
                          {ord.status}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {address.payment_method === "bank_transfer" ? "Bank Transfer" : "COD"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {ord.customer_name} • {ord.customer_email} • {ord.customer_phone || "No phone"}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      <div className="font-display text-lg text-primary">{formatPrice(ord.total)}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                      className="rounded-md border border-border p-2 text-muted-foreground hover:bg-background hover:text-foreground"
                      title={isExpanded ? "Collapse" : "Expand details"}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="border-t border-border bg-background/50 p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Shipping Info */}
                      <div>
                        <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                          Delivery Address
                        </h3>
                        <div className="mt-2 text-sm text-foreground">
                          <p className="font-medium">{ord.customer_name}</p>
                          <p>{address.address || "No address provided"}</p>
                          <p>{address.city || ""}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Phone: {ord.customer_phone}</p>
                          {address.notes && (
                            <p className="mt-2 rounded bg-card p-2 text-xs text-amber-300">
                              Note: {address.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Bank Slip Attachment (if uploaded) */}
                      {/* Bank Slip Attachment (if uploaded) — inline preview */}
                      {ord.receipt_url && (
                        <div className="mt-3 rounded border border-primary/30 bg-primary/5 p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            Payment Proof Attached:
                          </p>
                          <a
                            href={ord.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block overflow-hidden rounded border border-border bg-black/40"
                            title="Click to open full size"
                          >
                            <img
                              src={ord.receipt_url}
                              alt="Payment receipt screenshot"
                              loading="lazy"
                              className="max-h-72 w-full cursor-zoom-in object-contain transition-transform hover:scale-[1.02]"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.style.display = "none";
                              }}
                            />
                          </a>
                          <a
                            href={ord.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-foreground underline hover:text-primary"
                          >
                            📄 Open in new tab ↗
                          </a>
                        </div>
                      )}


                      {/* Status & Courier Tracking Controls */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                            Update Order Status
                          </label>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                orderId: ord.id,
                                status: e.target.value as OrderStatus,
                              })
                            }
                            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                            Courier Tracking Number (TCS / Leopards / Trax)
                          </label>
                          <div className="mt-1 flex gap-2">
                            <input
                              type="text"
                              value={
                                trackingInputs[ord.id] !== undefined
                                  ? trackingInputs[ord.id]
                                  : ord.tracking_number || ""
                              }
                              onChange={(e) =>
                                setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })
                              }
                              placeholder="e.g. TCS-7729104"
                              className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const val = trackingInputs[ord.id] ?? ord.tracking_number ?? "";
                                updateTrackingMutation.mutate({ orderId: ord.id, trackingNumber: val });
                              }}
                              className="btn-outline-dark px-3 py-1 text-xs"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="mt-6 border-t border-border pt-4">
                      <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                        Purchased Items
                      </h3>
                      <div className="mt-2 divide-y divide-border">
                        {ord.order_items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between py-2 text-xs">
                            <span className="text-foreground">
                              {item.product_name} × <strong className="text-primary">{item.quantity}</strong>
                            </span>
                            <span className="font-mono text-foreground">{formatPrice(item.line_total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
