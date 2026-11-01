import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Grip Force" },
      {
        name: "description",
        content: "Answers about Grip Force products, sizing, payments, shipping, tracking and returns.",
      },
      { property: "og:title", content: "FAQ — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

const GROUPS = [
  {
    title: "Products & Sizing",
    items: [
      { q: "How do I choose the right gripper resistance?", a: "Start with a level you can close for 8–10 comfortable reps and progress from there. Adjustable grippers let you change the resistance as your grip improves." },
      { q: "How do I pick my glove size?", a: "Measure the width of your palm just below the knuckles and match it to the chart on our Size Guide page. If you're between sizes, choose the larger one for comfort." },
      { q: "Are your resistance bands sold individually or in sets?", a: "Both. Individual bands, tube bands with handles and full sets are listed in the Resistance Bands collection — each product page states exactly what's included." },
      { q: "Do you have size charts for clothing?", a: "Yes. Every apparel product lists its available sizes, and the Size Guide page explains how to measure for the best fit." },
    ],
  },
  {
    title: "Payment",
    items: [
      { q: "Which payment methods do you accept?", a: "We accept major international debit and credit cards through Shopify's secure checkout. See the Payment Information page for the latest details." },
      { q: "Is payment taken before the order ships?", a: "Yes. Orders are prepared and dispatched once payment is confirmed. Card payments confirm instantly; if a manual method such as bank transfer is available, dispatch happens after the funds arrive." },
      { q: "What currency am I paying in?", a: "Prices are shown in US dollars (USD). Your bank handles the conversion to your local currency." },
    ],
  },
  {
    title: "Shipping & Tracking",
    items: [
      { q: "Which countries do you ship to?", a: "We ship internationally to serviceable destinations. The available countries and shipping rates for your address are shown at checkout." },
      { q: "How long does delivery take?", a: "Delivery times depend on your destination and the shipping service selected at checkout. Estimates appear before you complete your order." },
      { q: "How do I track my order?", a: "Once your parcel is dispatched you receive tracking information by email. You can also follow it on our Order Tracking page." },
      { q: "Will I pay customs charges?", a: "Import duties and taxes, if any, are set by your country's customs office and are the recipient's responsibility. We show shipping fees clearly at checkout." },
    ],
  },
  {
    title: "Returns",
    items: [
      { q: "Can I return a product?", a: "Yes — see our Returns & Refunds page for the conditions, timeframes and how to start a return." },
      { q: "What if my order arrives damaged?", a: "Contact us with a photo of the item and packaging, and we'll make it right under our returns policy." },
    ],
  },
];

function FaqPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="heading-section">Frequently Asked Questions</h1>
      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10">
          <h2 className="font-display text-2xl uppercase tracking-wide text-primary">{g.title}</h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {g.items.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                  {f.q}
                  <span className="font-display text-xl text-primary transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm text-muted-foreground">
        Didn't find your answer? <Link to="/contact" className="text-primary underline">Contact us</Link> and we'll help.
      </p>
    </div>
  );
}
