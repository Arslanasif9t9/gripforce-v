import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageCheck, ArrowRight, Truck } from "lucide-react";

type OrderSuccessSearch = { order?: string | undefined };

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>): OrderSuccessSearch => ({
    order: typeof search["order"] === "string" ? search["order"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Grip Force" },
      { name: "description", content: "Thank you for your order with Grip Force. We are preparing your fitness gear." },
      { property: "og:title", content: "Order Confirmed — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { order = "" } = Route.useSearch();

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl text-center">
        {/* Glowing Success Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-[0_0_40px_-10px_rgba(163,255,18,0.4)]">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>

        <h1 className="heading-section mt-6">Order Placed Successfully!</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Thank you for choosing Grip Force. Your fitness gear is being prepared for dispatch.
        </p>

        {/* Order Number Box */}
        {order && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Your Order Reference
            </div>
            <div className="mt-1 font-mono text-2xl font-bold tracking-wider text-primary">
              #{order}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              A confirmation email has been sent to your inbox. Please keep this order reference handy for tracking.
            </p>
          </div>
        )}

        {/* Next Steps Card */}
        <div className="mt-6 rounded-xl border border-border bg-card/60 p-6 text-left">
          <h2 className="font-display text-lg uppercase tracking-wide text-foreground">
            What Happens Next?
          </h2>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong>Order Processing:</strong> Our warehouse inspects and packs your accessories within 24 hours.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong>Dispatch & Delivery:</strong> Once dispatched, standard delivery takes 2–4 business days across Pakistan.
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/track"
            className="btn-neon flex items-center justify-center gap-2"
          >
            Track Order Status <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/shop"
            className="btn-outline-dark flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
