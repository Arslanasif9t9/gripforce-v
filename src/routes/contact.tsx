import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Grip Force" },
      {
        name: "description",
        content: "Questions about products, sizing, shipping or your order? Contact the Grip Force team.",
      },
      { property: "og:title", content: "Contact Us — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="heading-section">Contact Us</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about products, sizing, shipping or your order? Send us a message and our team will reply.
      </p>

      {sent ? (
        <div className="mt-8 rounded-xl border border-primary/50 bg-primary/10 p-6 text-primary">
          <p className="font-display text-xl uppercase tracking-wide">Message received</p>
          <p className="mt-2 text-sm">
            Thank you for reaching out. Our team will get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <form
          className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              <span className="text-foreground">Name</span>
              <input required className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-foreground">Email</span>
              <input required type="email" className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm">
            <span className="text-foreground">Subject</span>
            <select className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Product question</option>
              <option>Sizing help</option>
              <option>Shipping & delivery</option>
              <option>Order status</option>
              <option>Returns & refunds</option>
              <option>Other</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-foreground">Message</span>
            <textarea required rows={5} className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <button type="submit" className="btn-neon justify-self-start">Send Message</button>
          <p className="text-xs text-muted-foreground">
            Live chat and instant replies go live with the store opening.
          </p>
        </form>
      )}
    </div>
  );
}
