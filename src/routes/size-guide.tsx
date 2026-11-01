import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: [
      { title: "Size Guide — Grip Force" },
      { name: "description", content: "How to measure your hand and body for Grip Force gloves, sleeves and apparel." },
      { property: "og:title", content: "Size Guide — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SizeGuidePage,
});

function SizeGuidePage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span> Size Guide
      </nav>
      <h1 className="heading-section mt-3">Size Guide</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Measure before you order — a minute with a tape saves a return. Sizes below are the standard ranges offered
        on Grip Force gloves, sleeves and apparel; each product page lists the exact sizes available for that item.
      </p>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl uppercase tracking-wide text-primary">Gym gloves</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Measure the width of your palm in a straight line just below the knuckles (no thumb), in centimetres.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Palm width</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">S</td><td className="py-2 pr-4">7 – 8 cm</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">M</td><td className="py-2 pr-4">8 – 9 cm</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">L</td><td className="py-2 pr-4">9 – 10 cm</td></tr>
              <tr><td className="py-2 pr-4">XL</td><td className="py-2 pr-4">10 – 11.5 cm</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl uppercase tracking-wide text-primary">Knee & elbow sleeves, wrist wraps</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Sleeves: measure the circumference of the joint while standing, keeping the tape snug but not tight. Wraps
          are one-size with adjustable fastening unless a product page states otherwise.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl uppercase tracking-wide text-primary">Apparel</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Measure the fullest part of your chest and your natural waist, keeping the tape level. Choose your
          usual size for a regular training fit; size up one for a looser fit.
        </p>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        Between sizes? Go up for comfort. Still unsure?{" "}
        <Link to="/contact" className="text-primary underline">Contact us</Link> with your measurements and we'll
        recommend a size.
      </p>
    </div>
  );
}
