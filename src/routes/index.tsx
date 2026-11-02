import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import heroImg from "@/assets/hero-grip-force.jpg";
import { Marquee } from "@/components/marquee";
import { Reveal, SectionHeading } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { ProductRail } from "@/components/product-rail";
import { TiltBox } from "@/components/tilt-image";
import { COLLECTIONS, PRODUCTS, featuredProducts, productImage, productsByCollection } from "@/lib/catalog";

/** 3D hero is browser-only (WebGL) — loaded on the client, never during SSR. */
const Hero3D = lazy(() => import("@/components/hero-3d"));

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
    q: "How do I choose the right size for gloves and wraps?",
    a: "Each product page includes the available sizes, and our Size Guide explains how to measure for the best fit.",
  },
];

const GYM_ESSENTIALS_SLUGS = [
  "gym-gloves",
  "wrist-wraps",
  "lifting-straps",
  "dumbbells",
  "kettlebell",
  "duffel-bag",
  "insulated-bottle",
  "shaker-bottle",
];

function Index() {
  const featured = featuredProducts();
  const homeWorkout = productsByCollection("home-workout");
  const essentials = GYM_ESSENTIALS_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const starterKit = productsByCollection("bundles")[0];
  const categories = COLLECTIONS.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="gf-glow relative overflow-hidden bg-background">
        <div className="container-page relative grid items-center gap-8 py-14 lg:min-h-[640px] lg:grid-cols-2 lg:gap-6 lg:py-20">
          {/* Left: copy */}
          <Reveal className="relative z-10 order-2 lg:order-1">
            <p className="font-display text-lg uppercase tracking-[0.3em] text-primary">Train Hard. Grip Strong.</p>
            <h1 className="mt-3 max-w-xl text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
              Build your grip. <span className="text-primary">Own your strength.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
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
            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-primary neon-glow" aria-hidden />
              Premium quality gear · Tracked worldwide shipping
            </p>
          </Reveal>

          {/* Right: 3D scene (client-only, static styled frame as SSR/first-paint fallback) */}
          <div className="order-1 lg:order-2">
            <ClientOnly
              fallback={
                <div className="relative overflow-hidden rounded-2xl border border-border">
                  <img
                    src={heroImg}
                    alt="Grip Force fitness accessories on a dark background with neon green lighting"
                    className="h-[380px] w-full object-cover opacity-80 sm:h-[460px] lg:h-[560px]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="flex h-[380px] items-center justify-center sm:h-[460px] lg:h-[560px]">
                    <span className="font-display uppercase tracking-[0.3em] text-muted-foreground">Loading…</span>
                  </div>
                }
              >
                <Hero3D />
              </Suspense>
            </ClientOnly>
          </div>
        </div>

        {/* Scroll-down indicator */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:flex lg:flex-col lg:items-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <span className="mt-1 animate-bounce text-primary" aria-hidden>▼</span>
        </div>
      </section>

      {/* Neon marquee strip */}
      <Marquee />

      {/* Shop by category */}
      <section className="bg-background py-16">
        <div className="container-page">
          <Reveal>
            <SectionHeading sub="Eight focused collections — pick where your training starts.">Shop by Category</SectionHeading>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.handle} delay={i * 0.05}>
                <Link
                  to="/collections/$handle"
                  params={{ handle: c.handle }}
                  className="group relative block overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/70 card-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <img
                      src={productImage({ image: c.image })}
                      alt={c.name}
                      loading="lazy"
                      className="size-full object-cover transition duration-500 group-hover:scale-[1.08]"
                    />
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 neon-edge" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-xl uppercase tracking-wide group-hover:text-primary">{c.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Shop now →</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products — Swiper rail */}
      <section className="bg-light-bg py-16 text-light-fg">
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading sub="Hand-picked accessories our team trains with every week.">Featured Products</SectionHeading>
              <Link
                to="/shop"
                className="hidden shrink-0 font-display text-lg uppercase tracking-wider underline decoration-primary decoration-2 underline-offset-4 hover:text-primary sm:block"
              >
                View all
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <ProductRail products={featured} tone="light" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Home workout collection — Swiper rail */}
      <section className="bg-background py-16">
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading sub="Compact, easy-to-use gear for training at home.">Home Workout Collection</SectionHeading>
              <Link
                to="/collections/$handle"
                params={{ handle: "home-workout" }}
                className="hidden shrink-0 font-display text-lg uppercase tracking-wider underline decoration-primary decoration-2 underline-offset-4 hover:text-primary sm:block"
              >
                View collection
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <ProductRail products={homeWorkout} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gym essentials — Swiper rail */}
      <section className="bg-surface-2 py-16">
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading sub="Gloves, wraps, straps and gear that carry your whole session.">Gym Essentials</SectionHeading>
              <Link
                to="/shop"
                className="hidden shrink-0 font-display text-lg uppercase tracking-wider underline decoration-primary decoration-2 underline-offset-4 hover:text-primary sm:block"
              >
                View all
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <ProductRail products={essentials} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Starter Kit spotlight */}
      {starterKit && (
        <section className="gf-glow relative overflow-hidden bg-background py-16">
          <div className="container-page grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <TiltBox className="mx-auto aspect-square max-w-md overflow-hidden rounded-2xl border border-border">
                <img src={starterKit.image} alt={starterKit.name} loading="lazy" className="size-full object-cover" />
              </TiltBox>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-display text-lg uppercase tracking-[0.3em] text-primary">Complete Home Setup</p>
              <h2 className="heading-section mt-2 max-w-lg">{starterKit.name}</h2>
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{starterKit.description}</p>
              <ul className="mt-5 space-y-2">
                {starterKit.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="mt-0.5 text-primary" aria-hidden>✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/product/${starterKit.slug}`} className="btn-neon text-lg">
                  View Starter Kit
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Why Grip Force */}
      <section className="bg-light-bg py-16 text-light-fg">
        <div className="container-page">
          <Reveal>
            <SectionHeading sub="What you can count on with every Grip Force order.">Why Grip Force</SectionHeading>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-light-border bg-white p-6 shadow-sm transition hover:border-primary/60">
                  <span className="font-display text-3xl text-primary">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-xl uppercase tracking-wide">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-light-muted">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16">
        <div className="container-page max-w-3xl">
          <Reveal>
            <SectionHeading>Frequently Asked Questions</SectionHeading>
          </Reveal>
          <Reveal delay={0.08}>
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
          </Reveal>
          <p className="mt-4 text-sm text-muted-foreground">
            More questions? <Link to="/faq" className="text-primary underline">Read the full FAQ</Link> or{" "}
            <Link to="/contact" className="text-primary underline">contact us</Link>.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="gf-glow relative overflow-hidden bg-surface-2 py-16">
        <div className="container-page max-w-2xl text-center">
          <Reveal>
            <h2 className="heading-section">Join Grip Force</h2>
            <p className="mt-3 text-muted-foreground">
              Subscribe to hear about new products and genuine offers. You can unsubscribe at any time.
            </p>
            <NewsletterForm />
          </Reveal>
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
