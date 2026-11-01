import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-grip-force.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Grip Force — Train Hard. Grip Strong." },
      {
        name: "description",
        content:
          "Grip Force is a premium fitness accessories store for gym, home and outdoor training — hand grippers, gloves, bands, bags, bottles and recovery gear with worldwide shipping.",
      },
      { property: "og:title", content: "About Grip Force — Train Hard. Grip Strong." },
      { property: "og:description", content: "Premium gym and home fitness accessories, shipped worldwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Grip Force accessories" className="absolute inset-0 size-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="container-page relative py-24">
          <h1 className="text-5xl sm:text-6xl">About Grip Force</h1>
          <p className="mt-3 font-display text-lg uppercase tracking-[0.3em] text-primary">Train Hard. Grip Strong.</p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-5 leading-relaxed text-foreground/90">
          <p>
            Grip Force exists for one reason: to help you train harder. We stock the accessories that make every
            session count — hand grippers that build real grip strength, gloves that protect your palms, bands that
            add resistance anywhere, and the bottles, bags and recovery tools that keep you consistent.
          </p>
          <p>
            Every product in our catalog is selected for genuine training value and shipped from our own inventory.
            We keep things compact and practical, so whether you train in a full gym or your living room, the right
            gear is never more than a parcel away.
          </p>
          <p>
            We serve customers internationally with clear pricing in USD, tracked shipping, and honest information
            about every product we sell. No hype, no invented claims — just reliable accessories that hold up to
            real work.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl uppercase tracking-wide text-primary">What we sell</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Hand & grip trainers, gym gloves, lifting straps and wraps, resistance bands, dumbbells and
              kettlebells, home workout equipment, yoga and flexibility tools, gym bags, bottles and shakers,
              recovery and massage gear, and curated bundle kits.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl uppercase tracking-wide text-primary">How we ship</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Orders are packed from our own stock and dispatched with tracked international delivery. Rates and
              delivery estimates appear at checkout before you pay.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl uppercase tracking-wide text-primary">Questions?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our team answers product and order questions every day.{" "}
              <Link to="/contact" className="text-primary underline">Contact us</Link> and we'll help you choose the
              right gear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
