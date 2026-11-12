import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

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

const SUBJECTS = [
  "Product question",
  "Sizing help",
  "Shipping & delivery",
  "Order status",
  "Returns & refunds",
  "Other",
];

function ContactPage() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]!);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signed-in customers get their email filled in.
  useEffect(() => {
    if (user?.email) setEmail((prev) => prev || user.email!);
  }, [user]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    // No .select() here: guests may insert but never read messages.
    const { error: err } = await supabase.from("support_messages").insert({
      user_id: user?.id ?? null,
      customer_name: name.trim(),
      customer_email: email.trim(),
      subject,
      message: message.trim(),
    });
    setBusy(false);
    if (err) {
      setError("Sorry, we could not send your message. Please try again in a moment.");
      return;
    }
    setSent(true);
  };

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
          onSubmit={submit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              <span className="text-foreground">Name</span>
              <input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-foreground">Email</span>
              <input required type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm">
            <span className="text-foreground">Subject</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-foreground">Message</span>
            <textarea required rows={5} maxLength={5000} value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-md border border-input bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          {error && (
            <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-neon justify-self-start disabled:opacity-60">
            {busy ? "Sending…" : "Send Message"}
          </button>
          <p className="text-xs text-muted-foreground">
            Live chat and instant replies go live with the store opening.
          </p>
        </form>
      )}
    </div>
  );
}
