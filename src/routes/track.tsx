import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Order Tracking — Grip Force" },
      { name: "description", content: "Track your Grip Force order with your order number." },
      { property: "og:title", content: "Order Tracking — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  return (
    <div className="container-page max-w-2xl py-20 text-center">
      <h1 className="heading-section">Order Tracking</h1>
      <p className="mt-3 text-muted-foreground">
        Order tracking goes live when the Grip Force store opens. Once it does, you'll enter your order number here
        and follow every step from packing to delivery.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
        <h2 className="font-display text-lg uppercase tracking-wide text-primary">In the meantime</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          After the store opens, every order confirmation email includes a tracking link, and the tracking number
          also appears on this page. If you have a question about an existing order right now,{" "}
          <Link to="/contact" className="text-primary underline">contact us</Link> with your order number.
        </p>
      </div>
    </div>
  );
}
