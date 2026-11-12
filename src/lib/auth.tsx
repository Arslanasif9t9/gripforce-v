import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Auth state for the whole site.
 * - `isAdmin` comes from the database function `has_role('admin')`.
 * - This is only for showing/hiding screens. Real protection is RLS in the database.
 */
type AuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  /** true until the first session check AND the admin check are finished */
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function checkAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", { _role: "admin" });
  return !error && data === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const apply = (next: Session | null) => {
      if (!active) return;
      setSession(next);
      if (!next) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // Do not call Supabase directly inside the auth callback (can deadlock).
      setTimeout(() => {
        checkAdmin()
          .then((ok) => {
            if (active) setIsAdmin(ok);
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      }, 0);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => apply(next));
    supabase.auth
      .getSession()
      .then(({ data }) => apply(data.session))
      .catch(() => apply(null));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user: session?.user ?? null,
      session,
      isAdmin,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, isAdmin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
