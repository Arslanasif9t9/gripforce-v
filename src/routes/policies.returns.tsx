import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyShell } from "./policies.shipping";

export const Route = createFileRoute("/policies/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — Grip Force" },
      { name: "description", content: "Grip Force returns and refunds policy for fitness accessory orders." },
      { property: "og:title", content: "Returns & Refunds — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReturnsPolicy,
});

function ReturnsPolicy() {
  return (
    <PolicyShell title="Returns & Refunds">
      <p>
        We want you to be happy with your Grip Force order. If something isn't right, this policy explains what we
        can do.
      </p>
      <h2>Return window</h2>
      <p>
        You may request a return within 14 days of receiving your order. Items must be unused, in their original
        packaging and in the condition you received them.
      </p>
      <h2>How to start a return</h2>
      <p>
        Contact us with your order number and the reason for the return. We'll confirm the return address and the
        next steps. Please do not send items back without contacting us first.
      </p>
      <h2>Refunds</h2>
      <p>
        Once your return arrives and is inspected, we refund the item's price to your original payment method.
        Original shipping charges are non-refundable unless the item was faulty or sent in error.
      </p>
      <h2>Damaged or incorrect items</h2>
      <p>
        If your order arrives damaged or you receive the wrong item, contact us within 7 days with photos of the
        item and packaging. We'll arrange a replacement or a full refund, including shipping.
      </p>
      <h2>Non-returnable situations</h2>
      <p>
        For hygiene reasons, items that have been used, worn during training, or returned outside the 14-day window
        cannot be accepted.
      </p>
      <p className="text-xs text-muted-foreground">
        Final return terms are confirmed in Shopify before the store opens and may be adjusted to match the actual
        shipping arrangements.
      </p>
    </PolicyShell>
  );
}
