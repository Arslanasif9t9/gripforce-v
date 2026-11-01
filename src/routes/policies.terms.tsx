import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "./policies.shipping";

export const Route = createFileRoute("/policies/privacy")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Grip Force" },
      { name: "description", content: "The terms that apply when you shop with Grip Force." },
      { property: "og:title", content: "Terms of Service — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyShell title="Terms of Service">
      <p>
        By using the Grip Force store and placing an order, you agree to the terms below.
      </p>
      <h2>Orders and payment</h2>
      <p>
        All orders require full payment in advance before dispatch. Prices are displayed in US dollars (USD). An
        order is accepted when we confirm it; we may decline an order if payment cannot be verified or if the
        destination is not serviceable.
      </p>
      <h2>Products and stock</h2>
      <p>
        We sell from our own inventory and list only products that are available. Product photos and specifications
        are provided as accurately as possible; minor variations in appearance between production batches may occur.
      </p>
      <h2>Shipping</h2>
      <p>
        Delivery times and rates shown at checkout are estimates provided by the courier service. See our Shipping
        Policy for full details.
      </p>
      <h2>Returns</h2>
      <p>
        Returns and refunds follow our Returns & Refunds policy.
      </p>
      <h2>Limitations</h2>
      <p>
        Grip Force products are fitness training accessories, not medical devices. Nothing sold in this store is
        intended to diagnose, treat or cure any condition. If you have a health concern, consult a professional
        before starting a training program.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Contact us through the Contact page.
      </p>
      <p className="text-xs text-muted-foreground">
        Final legal terms are confirmed in Shopify before the store opens.
      </p>
    </PolicyShell>
  );
}
