import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { COLLECTIONS, getCollection, productsByCollection } from "@/lib/catalog";

export const Route = createFileRoute("/collections/$handle")({
  beforeLoad: ({ params }) => {
    if (!getCollection(params.handle)) throw notFound();
  },
  head: ({ params }) => {
    const collection = getCollection(params.handle);
    const name = collection?.name ?? "Collection";
    return {
      meta: [
        { title: `${name} — Grip Force` },
        {
          name: "description",
          content:
            collection?.description ??
            "Shop Grip Force fitness accessories for gym, home and outdoor training.",
        },
        { property: "og:title", content: `${name} — Grip Force` },
        { property: "og:description", content: collection?.description ?? "Grip Force fitness accessories." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useParams();
  const collection = getCollection(handle)!;
  const products = productsByCollection(handle);

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span>{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> <span aria-hidden>/</span> {collection.name}
      </nav>
      <h1 className="heading-section mt-3">{collection.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{collection.description}</p>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {/* Other collections */}
      <section className="mt-16">
        <h2 className="font-display text-2xl uppercase tracking-wide">Keep exploring</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {COLLECTIONS.filter((c) => c.handle !== handle).map((c) => (
            <Link
              key={c.handle}
              to="/collections/$handle"
              params={{ handle: c.handle }}
              className="rounded-full border border-border px-4 py-2 font-display text-base uppercase tracking-wider text-foreground hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
