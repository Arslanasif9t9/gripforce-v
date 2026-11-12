import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Grip Force" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function Message({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="container-page flex justify-center py-24">
      <div className="max-w-md text-center">
        <h1 className="heading-section">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) return <Message title="Checking access…" text="One moment." />;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <Message
        title="No access"
        text="This area is only for the store owner. If this is your store, sign in with the owner email and confirm it by email."
        action={
          <div className="flex justify-center gap-2">
            <Link to="/" className="btn-neon">Go home</Link>
            <button onClick={() => signOut()} className="btn-outline-dark">Sign out</button>
          </div>
        }
      />
    );
  }

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28 lg:self-start">
        <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">Admin</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
        <nav className="mt-4 grid gap-1" aria-label="Admin navigation">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider hover:bg-secondary"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider hover:bg-secondary"
          >
            Products
          </Link>
          <Link
            to="/admin/coupons"
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider hover:bg-secondary"
          >
            Coupons
          </Link>
          <Link
            to="/admin/banners"
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider hover:bg-secondary"
          >
            Banners
          </Link>
          <Link
            to="/admin/support"
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider hover:bg-secondary"
          >
            Support
          </Link>
          <Link
            to="/admin/orders"
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider hover:bg-secondary"
          >
            Orders
          </Link>
        </nav>
        <button onClick={() => signOut()} className="btn-outline-dark mt-4 w-full">
          Sign out
        </button>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
