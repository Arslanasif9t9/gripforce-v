import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { COLLECTIONS, PRODUCTS } from "@/lib/catalog";

type Search = { collection?: string; sort?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    collection: typeof search.collection === "string" ? search.collection : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — Grip Force" },
      {
        name: "description",
        content:
          "Browse the full Grip Force catalog: hand grippers, gym gloves, strength training gear, resistance bands, home workout equipment, bags, bottles and recovery tools.",
      },
      { property: "og:title", content: "Shop All — Grip Force" },
      { property: "og:description", content: "Browse the full Grip Force fitness accessories catalog." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name A–Z" },
] as const;

function ShopPage() {
  const { collection, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  let products = PRODUCTS;
  if (collection) products = products.filter((p) => p.collection === collection);

  const sorted = [...products];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  else sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span> Shop All
      </nav>
      <h1 className="heading-section mt-3">Shop All</h1>
      <p className="mt-2 text-muted-foreground">{sorted.length} products</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside>
          <h2 className="font-display text-xl uppercase tracking-wider">Categories</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <button
                onClick={() => navigate({ to: "/shop", search: { sort } })}
                className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary ${!collection ? "bg-secondary text-primary" : "text-muted-foreground"}`}
              >
                All Products ({PRODUCTS.length})
              </button>
            </li>
            {COLLECTIONS.map((c) => {
              const count = PRODUCTS.filter((p) => p.collection === c.handle).length;
              return (
                <li key={c.handle}>
                  <button
                    onClick={() => navigate({ to: "/shop", search: { collection: c.handle, sort } })}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary ${collection === c.handle ? "bg-secondary text-primary" : "text-muted-foreground"}`}
                  >
                    {c.name} ({count})
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-end gap-2">
            <label htmlFor="sort" className="text-sm text-muted-foreground">Sort by</label>
            <select
              id="sort"
              value={sort ?? "featured"}
              onChange={(e) => navigate({ to: "/shop", search: { collection, sort: e.target.value } })}
              className="rounded-md border border-input bg-surface-2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {sorted.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          {sorted.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">No products found in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
