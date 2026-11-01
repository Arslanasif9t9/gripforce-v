import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/payment-info")({
  head: () => ({
    meta: [
      { title: "Payment Information — Grip Force" },
      { name: "description", content: "Payment methods, currency and security for Grip Force orders." },
      { property: "og:title", content: "Payment Information — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentInfoPage,
});

function PaymentInfoPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span> Payment Information
      </nav>
      <h1 className="heading-section mt-3">Payment Information</h1>
      <div className="mt-6 space-y-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl uppercase tracking-wide text-primary">Payment methods</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Grip Force accepts major international debit and credit cards through Shopify's secure checkout. Your
            card details are handled entirely by the payment provider — they are never stored on our website.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Where available, additional manual methods such as international bank transfer may be offered for larger
            orders. Bank transfer orders are prepared and dispatched only after the funds have actually arrived — a
            transfer receipt alone is not proof of payment.
          </p>
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl uppercase tracking-wide text-primary">Currency</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            All prices are shown in US dollars (USD). If your card is in another currency, your bank applies its own
            conversion rate and may charge a small foreign-transaction fee.
          </p>
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl uppercase tracking-wide text-primary">Security</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Checkout is encrypted and runs on Shopify's payment infrastructure. Orders are dispatched after payment
            is confirmed, and we may contact you to verify unusually large orders before shipping.
          </p>
        </section>
        <p className="text-xs text-muted-foreground">
          The final list of enabled payment methods for your country is confirmed at checkout when the store opens.
          Questions? <Link to="/contact" className="text-primary underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
