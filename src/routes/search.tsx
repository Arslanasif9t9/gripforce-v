import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/catalog";

type Search = { q?: string | undefined };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Search — Grip Force" },
      { name: "description", content: "Search Grip Force fitness accessories by product name or category." },
      { property: "og:title", content: "Search — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const results = searchProducts(q);

  return (
    <div className="container-page py-10">
      <h1 className="heading-section">
        {q ? <>Search: “{q}”</> : "Search"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Type in the search bar above to find products."}
      </p>
      {q && results.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
      {q && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No products matched your search.</p>
          <Link to="/shop" className="btn-neon mt-6">Browse all products</Link>
        </div>
      )}
    </div>
  );
}
