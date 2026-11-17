import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Grip Force" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const inputClass =
  "w-full rounded-md border border-input bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function LoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in: admin goes to dashboard, customer goes to home
  useEffect(() => {
    if (loading || !user) return;
    navigate({ to: isAdmin ? "/admin" : "/" });
  }, [loading, user, isAdmin, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (err) {
          setError(err.message === "Invalid login credentials" ? "Invalid email or password. Please try again." : err.message);
        }
      } else {
        const { error: err } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (err) {
          setError(err.message);
        } else {
          setNotice("Account created successfully! Check your email and click the confirmation link, then sign in.");
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    setError(null);
    setNotice(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Type your email above first, then click “Forgot password?”.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) setError(err.message);
    else setNotice("If this email has an account, a reset link is on its way. Check your inbox.");
  };

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="heading-section text-center">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Welcome back to Grip Force." : "Join Grip Force to track orders and save your delivery details."}
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Password</span>
            <input
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
              minLength={8}
              required
            />
            {mode === "signup" && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Minimum 8 characters. Must not be a common or easily guessable password.
              </p>
            )}
          </label>

          {error && (
            <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-sm text-primary">
              {notice}
            </p>
          )}

          {mode === "signin" && (
            <button type="button" onClick={forgot} disabled={busy} className="justify-self-start text-sm text-primary underline">
              Forgot password?
            </button>
          )}

          <button type="submit" disabled={busy} className="btn-neon mt-2 w-full disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
