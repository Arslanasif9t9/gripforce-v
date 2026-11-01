import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Grip Force" },
      { name: "description", content: "How Grip Force packs, ships and tracks your fitness accessory orders worldwide." },
      { property: "og:title", content: "Shipping Policy — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShippingPolicy,
});

function ShippingPolicy() {
  return (
    <PolicyShell title="Shipping Policy">
      <p>
        Grip Force ships every order from our own inventory. Once your payment is confirmed, your items are packed
        and handed to a tracked courier service.
      </p>
      <h2>Processing time</h2>
      <p>
        Orders are prepared for dispatch within 1–3 business days after payment confirmation. You receive a
        confirmation email with tracking details as soon as your parcel leaves our facility.
      </p>
      <h2>Shipping rates and delivery estimates</h2>
      <p>
        Available destinations, shipping services and exact rates for your address are shown at checkout before you
        pay. Delivery estimates depend on the destination and the service you select.
      </p>
      <h2>Customs, duties and taxes</h2>
      <p>
        Import duties, taxes and customs fees, where they apply, are set by your country's customs office and are
        the recipient's responsibility. Grip Force is not responsible for delays caused by customs processing.
      </p>
      <h2>Order tracking</h2>
      <p>
        Tracked services are used wherever available. You can follow your parcel with the tracking number in your
        dispatch email, or on our <Link to="/track" className="text-primary underline">Order Tracking</Link> page.
      </p>
      <h2>Packages lost or damaged in transit</h2>
      <p>
        If your parcel arrives damaged or does not arrive, contact us with your order number and we will work with
        the courier to resolve it under our <Link to="/policies/returns" className="text-primary underline">Returns & Refunds</Link> policy.
      </p>
      <p className="text-xs text-muted-foreground">
        Final shipping rates, courier partners and destination list are confirmed in Shopify before the store opens.
      </p>
    </PolicyShell>
  );
}

export function PolicyShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-page max-w-3xl py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span> {title}
      </nav>
      <h1 className="heading-section mt-3">{title}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-primary [&_p]:text-sm [&_p]:sm:text-base">
        {children}
      </div>
    </div>
  );
}
