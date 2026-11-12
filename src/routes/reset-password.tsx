import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Grip Force" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const inputClass =
  "w-full rounded-md border border-input bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

/** The email link signs the person in with a short recovery session. Here they choose a new password. */
function ResetPasswordPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords are not the same.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError(err.message);
    setDone(true);
    window.setTimeout(() => navigate({ to: "/login" }), 1500);
  };

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="heading-section text-center">New password</h1>
        {loading ? (
          <p className="mt-4 text-center text-sm text-muted-foreground">One moment…</p>
        ) : !user ? (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>This reset link is not valid or has expired.</p>
            <Link to="/login" className="mt-4 inline-block text-primary underline">
              Go to sign in and ask for a new link
            </Link>
          </div>
        ) : done ? (
          <p role="status" className="mt-4 rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-center text-sm text-primary">
            Password changed. Taking you to sign in…
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">New password</span>
              <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Repeat new password</span>
              <input type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
            </label>
            {error && (
              <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-neon mt-1 w-full disabled:opacity-60">
              {busy ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
