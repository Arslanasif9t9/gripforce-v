import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/grip-force-logo.png";
import { COLLECTIONS } from "@/lib/catalog";
import { useCartCount } from "@/lib/cart";

const PRIMARY = ["hand-grip", "gym-gloves", "strength-training", "home-workout", "resistance-bands"];
const MORE_HANDLES = ["gym-bags", "hydration", "recovery-mobility", "yoga-flexibility", "gym-wear", "bundles"];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M6 6h15l-1.5 9h-12L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

export function SiteHeader() {
  const count = useCartCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    setQuery("");
    navigate({ to: "/search", search: { q } });
  };

  const primary = COLLECTIONS.filter((c) => PRIMARY.includes(c.handle));
  const more = COLLECTIONS.filter((c) => MORE_HANDLES.includes(c.handle));

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-page flex items-center justify-center gap-3 py-1.5 text-center">
          <p className="font-display text-sm uppercase tracking-[0.15em]">
            Premium fitness accessories — Train Hard. Grip Strong.
          </p>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Grip Force home">
            <img src={logo} alt="Grip Force — Train Hard. Grip Strong." className="h-12 w-12 rounded-lg object-contain sm:h-14 sm:w-14" />
            <span className="ml-2 hidden font-display text-2xl uppercase tracking-wide sm:block">
              Grip <span className="text-primary">Force</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <Link
              to="/shop"
              className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary hover:text-primary"
            >
              Shop All
            </Link>
            {primary.map((c) => (
              <Link
                key={c.handle}
                to="/collections/$handle"
                params={{ handle: c.handle }}
                className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
            <div className="group relative">
              <button className="rounded-md px-3 py-2 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary hover:text-primary">
                More ▾
              </button>
              <div className="invisible absolute right-0 top-full z-50 w-60 rounded-lg border border-border bg-popover p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                {more.map((c) => (
                  <Link
                    key={c.handle}
                    to="/collections/$handle"
                    params={{ handle: c.handle }}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-popover-foreground hover:bg-secondary hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ))}
                <div className="my-1 border-t border-border" />
                <Link
                  to="/about"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-popover-foreground hover:bg-secondary hover:text-primary"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-popover-foreground hover:bg-secondary hover:text-primary"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              className="rounded-md p-2 text-foreground hover:bg-secondary"
              aria-label="Search products"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <SearchIcon />
            </button>
            <Link to="/track" className="hidden rounded-md p-2 text-foreground hover:bg-secondary sm:block" aria-label="Track order">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
            </Link>
            <Link to="/cart" className="relative rounded-md p-2 text-foreground hover:bg-secondary" aria-label={`Cart (${count} items)`}>
              <CartIcon />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary font-display text-xs text-primary-foreground">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background">
            <form onSubmit={submitSearch} className="container-page flex gap-2 py-3">
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search grippers, gloves, bands, bottles…"
                className="flex-1 rounded-md border border-input bg-surface-2 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Search products"
              />
              <button type="submit" className="btn-neon px-6 py-2 text-base">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="border-t border-border bg-background lg:hidden" aria-label="Mobile navigation">
            <div className="container-page grid gap-1 py-3">
              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-secondary hover:text-primary"
              >
                Shop All
              </Link>
              {COLLECTIONS.map((c) => (
                <Link
                  key={c.handle}
                  to="/collections/$handle"
                  params={{ handle: c.handle }}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-secondary hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
              <div className="my-1 border-t border-border" />
              <Link to="/about" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 font-medium hover:bg-secondary hover:text-primary">
                About Us
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 font-medium hover:bg-secondary hover:text-primary">
                Contact Us
              </Link>
              <Link to="/track" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 font-medium hover:bg-secondary hover:text-primary">
                Track Order
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
