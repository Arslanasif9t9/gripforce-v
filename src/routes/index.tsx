import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-grip-force.jpg";
import { ProductCard } from "@/components/product-card";
import { COLLECTIONS, PRODUCTS, featuredProducts, productImage, productsByCollection } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grip Force — Premium Gym & Home Fitness Accessories" },
      {
        name: "description",
        content:
          "Build your grip. Own your strength. Shop hand grippers, gym gloves, resistance bands, home workout gear, gym bags and hydration accessories with secure checkout and worldwide shipping.",
      },
      { property: "og:title", content: "Grip Force — Premium Gym & Home Fitness Accessories" },
      {
        property: "og:description",
        content: "Build your grip. Own your strength. Premium gym and home workout accessories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHY = [
  {
    title: "Carefully Selected Accessories",
    text: "Every product is chosen for real training value — compact, practical and built to last.",
  },
  {
    title: "Secure Checkout",
    text: "Checkout runs on Shopify with encrypted payments. Your details stay protected.",
  },
  {
    title: "Clear Shipping Information",
    text: "Honest dispatch times and tracking on every order, with no hidden charges.",
  },
  {
    title: "Reliable Customer Support",
    text: "Questions before or after your order? Our team is ready to help.",
  },
  {
    title: "Transparent Returns Policy",
    text: "If something isn't right, our returns policy explains exactly what to do.",
  },
];

const FAQS = [
  {
    q: "Do you ship internationally?",
    a: "Yes. Grip Force ships worldwide from our own inventory. Available destinations, shipping rates and delivery estimates are shown at checkout, and any import duties are set by your local customs office.",
  },
  {
    q: "How are orders shipped?",
    a: "Every order is packed from our own stock and handed to a tracked courier service. You receive tracking information as soon as your parcel is dispatched.",
  },
  {
    q: "Which currency are prices shown in?",
    a: "Prices are displayed in US dollars (USD). Your card issuer or bank handles the final conversion for your local currency.",
  },
  {
    q: "What payment methods can I use?",
    a: "We accept major international debit and credit cards through Shopify's secure checkout. See the Payment Information page for details.",
  },
  {
    q: "How do I choose the right size for gloves and sleeves?",
    a: "Each product page includes the available sizes, and our Size Guide explains how to measure your hand for the best fit.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. Our Returns & Refunds policy explains the conditions and steps for returning an item.",
  },
];

const GYM_ESSENTIALS = ["gym-gloves", "strength-training", "hydration", "gym-bags", "hand-grip"];

function Index() {
  const featured = featuredProducts().slice(0, 8);
  const homeWorkout = productsByCollection("home-workout").slice(0, 4);
  const gymEssentials = PRODUCTS.filter((p) => GYM_ESSENTIALS.includes(p.collection)).slice(0, 8);
  const bundles = productsByCollection("bundles").slice(0, 4);
  const categories = COLLECTIONS.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <img
          src={heroImg}
          alt="Grip Force fitness accessories on a dark background with neon green lighting"
          className="absolute inset-0 size-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="container-page relative flex min-h-[520px] flex-col justify-center py-20">
          <p className="font-display text-lg uppercase tracking-[0.3em] text-primary">Train Hard. Grip Strong.</p>
          <h1 className="mt-3 max-w-2xl text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
            Build your grip. <span className="text-primary">Own your strength.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Discover premium gym and home workout accessories designed to support your fitness journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-neon text-lg">
              Shop Now
            </Link>
            <Link to="/collections/$handle" params={{ handle: "home-workout" }} className="btn-outline-dark text-lg">
              Explore Home Fitness
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="bg-background py-16">
        <div className="container-page">
          <h2 className="heading-section">Shop by Category</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.handle}
                to="/collections/$handle"
                params={{ handle: c.handle }}
                className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/60"
              >
                <div className="aspect-[4/3] overflow-hidden bg-light-bg">
                  <img
                    src={productImage({ image: c.image })}
                    alt={c.name}
                    loading="lazy"
                    className="size-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl uppercase tracking-wide group-hover:text-primary">{c.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-light-bg py-16 text-light-fg">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="heading-section text-light-fg">Featured Products</h2>
              <p className="mt-2 text-light-muted">Hand-picked accessories our team trains with every week.</p>
            </div>
            <Link to="/shop" className="hidden font-display text-lg uppercase tracking-wider text-light-fg underline decoration-primary decoration-2 underline-offset-4 sm:block">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Home workout collection */}
      <section className="bg-background py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="heading-section">Home Workout Collection</h2>
              <p className="mt-2 text-muted-foreground">Compact, easy-to-use gear for training at home.</p>
            </div>
            <Link
              to="/collections/home-workout"
              className="hidden font-display text-lg uppercase tracking-wider text-foreground underline decoration-primary decoration-2 underline-offset-4 sm:block"
            >
              View collection
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {homeWorkout.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Gym essentials */}
      <section className="bg-light-bg py-16 text-light-fg">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="heading-section text-light-fg">Gym Essentials</h2>
              <p className="mt-2 text-light-muted">Gloves, wraps, bottles, towels and bags — carry it all in comfort.</p>
            </div>
            <Link to="/shop" className="hidden font-display text-lg uppercase tracking-wider text-light-fg underline decoration-primary decoration-2 underline-offset-4 sm:block">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {gymEssentials.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundle offers */}
      <section className="bg-background py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="heading-section">Bundle Offers</h2>
              <p className="mt-2 text-muted-foreground">Real accessory kits with honest pricing.</p>
            </div>
            <Link
              to="/collections/bundles"
              className="hidden font-display text-lg uppercase tracking-wider text-foreground underline decoration-primary decoration-2 underline-offset-4 sm:block"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {bundles.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Grip Force */}
      <section className="bg-surface-2 py-16">
        <div className="container-page">
          <h2 className="heading-section">Why Grip Force</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <div key={w.title} className="rounded-xl border border-border bg-card p-6">
                <span className="font-display text-3xl text-primary">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl uppercase tracking-wide">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16">
        <div className="container-page max-w-3xl">
          <h2 className="heading-section">Frequently Asked Questions</h2>
          <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                  {f.q}
                  <span className="font-display text-xl text-primary transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            More questions? <Link to="/faq" className="text-primary underline">Read the full FAQ</Link> or{" "}
            <Link to="/contact" className="text-primary underline">contact us</Link>.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-surface-2 py-16">
        <div className="container-page max-w-2xl text-center">
          <h2 className="heading-section">Join Grip Force</h2>
          <p className="mt-3 text-muted-foreground">
            Subscribe to hear about new products and genuine offers. You can unsubscribe at any time.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mt-6 rounded-lg border border-primary/50 bg-primary/10 px-6 py-4 text-primary">
        You're on the list. Welcome to Grip Force.
      </p>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="flex-1 rounded-md border border-input bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button type="submit" className="btn-neon">
        Subscribe
      </button>
    </form>
  );
}
