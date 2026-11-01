import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "./policies.shipping";

export const Route = createFileRoute("/policies/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Grip Force" },
      { name: "description", content: "How Grip Force collects, uses and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <PolicyShell title="Privacy Policy">
      <p>
        Grip Force respects your privacy. This policy explains what information we collect when you use our store
        and how we handle it.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you place an order or create an account, we collect the details needed to fulfil it: your name,
        contact information, shipping address and order contents. Payment card details are processed directly by
        our payment provider during checkout and are never stored by Grip Force.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your information to process orders, arrange delivery, provide customer support, send order updates,
        and — only with your consent — send marketing emails you can unsubscribe from at any time.
      </p>
      <h2>Sharing</h2>
      <p>
        We share only what is necessary with the services that run the store: our e-commerce platform, payment
        provider and shipping couriers. We never sell your personal information.
      </p>
      <h2>Cookies</h2>
      <p>
        Our store uses cookies to keep your cart working, remember preferences and measure how the store is used so
        we can improve it.
      </p>
      <h2>Your rights</h2>
      <p>
        You can request a copy of your personal data, ask us to correct it, or ask us to delete it. Contact us and
        we'll respond as required by applicable law.
      </p>
      <p className="text-xs text-muted-foreground">
        This draft policy is finalized in Shopify before the store opens, matching the store's actual data
        practices and jurisdictions.
      </p>
    </PolicyShell>
  );
}
