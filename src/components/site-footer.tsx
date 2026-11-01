import { Link } from "@tanstack/react-router";
import logo from "@/assets/grip-force-logo.png";
import { COLLECTIONS } from "@/lib/catalog";

const SHOP_LINKS = ["hand-grip", "gym-gloves", "strength-training", "home-workout", "resistance-bands", "bundles"];

export function SiteFooter() {
  const shop = COLLECTIONS.filter((c) => SHOP_LINKS.includes(c.handle));

  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2" aria-label="Grip Force home">
            <img src={logo} alt="Grip Force logo" className="h-12 w-12 rounded-lg object-contain" />
            <span className="font-display text-2xl uppercase tracking-wide">
              Grip <span className="text-primary">Force</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Premium gym and home fitness accessories — hand grippers, gloves, bands, bags and more.
            Train Hard. Grip Strong.
          </p>
        </div>

        {/* Shop */}
        <nav aria-label="Shop links">
          <h3 className="font-display text-lg uppercase tracking-wider text-foreground">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/shop" className="text-muted-foreground hover:text-primary">
                Shop All
              </Link>
            </li>
            {shop.map((c) => (
              <li key={c.handle}>
                <Link to="/collections/$handle" params={{ handle: c.handle }} className="text-muted-foreground hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support */}
        <nav aria-label="Support links">
          <h3 className="font-display text-lg uppercase tracking-wider text-foreground">Support</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            <li><Link to="/track" className="text-muted-foreground hover:text-primary">Order Tracking</Link></li>
            <li><Link to="/policies/shipping" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
            <li><Link to="/policies/returns" className="text-muted-foreground hover:text-primary">Returns & Refunds</Link></li>
            <li><Link to="/payment-info" className="text-muted-foreground hover:text-primary">Payment Information</Link></li>
            <li><Link to="/size-guide" className="text-muted-foreground hover:text-primary">Size Guide</Link></li>
          </ul>
        </nav>

        {/* Legal + info */}
        <nav aria-label="Company links">
          <h3 className="font-display text-lg uppercase tracking-wider text-foreground">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Grip Force</Link></li>
            <li><Link to="/policies/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Secure checkout. Major cards accepted. Prices shown in USD.
          </p>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Grip Force. All rights reserved.
          </p>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Train Hard. <span className="text-primary">Grip Strong.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
