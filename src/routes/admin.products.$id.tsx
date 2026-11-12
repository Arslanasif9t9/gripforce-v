import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "@/components/admin/product-form";
import { dbErrorMessage, rowToForm, type ProductRow } from "@/lib/admin-products";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const product = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async (): Promise<ProductRow | null> => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-primary underline">
        ← Back to products
      </Link>
      <h1 className="heading-section mt-3">Edit product</h1>

      {product.isLoading && <p className="mt-5 text-sm text-muted-foreground">Loading…</p>}
      {product.isError && <p className="mt-5 text-sm text-destructive">Could not load this product.</p>}
      {product.data === null && <p className="mt-5 text-sm text-muted-foreground">Product not found. It may have been deleted.</p>}

      {product.data && (
        <div className="mt-5">
          <ProductForm
            // key makes the form reset if another product is opened
            key={product.data.id}
            initial={rowToForm(product.data)}
            existingSlug={product.data.slug}
            submitLabel="Save changes"
            onSubmit={async (payload) => {
              const { error } = await supabase
                .from("products")
                .update({ ...payload, updated_at: new Date().toISOString() })
                .eq("id", id);
              if (error) return dbErrorMessage(error);
              await qc.invalidateQueries({ queryKey: ["admin-products"] });
              await qc.invalidateQueries({ queryKey: ["admin-product", id] });
              await qc.invalidateQueries({ queryKey: ["catalog"] });
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
}
