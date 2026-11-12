import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "@/components/admin/product-form";
import { EMPTY_PRODUCT_FORM, dbErrorMessage } from "@/lib/admin-products";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-primary underline">
        ← Back to products
      </Link>
      <h1 className="heading-section mt-3">Add product</h1>
      <div className="mt-5">
        <ProductForm
          initial={EMPTY_PRODUCT_FORM}
          submitLabel="Create product"
          onSubmit={async (payload) => {
            const { error } = await supabase.from("products").insert(payload);
            if (error) return dbErrorMessage(error);
            await qc.invalidateQueries({ queryKey: ["admin-products"] });
            await qc.invalidateQueries({ queryKey: ["admin-count", "products"] });
            await qc.invalidateQueries({ queryKey: ["catalog"] });
            navigate({ to: "/admin/products" });
            return null;
          }}
        />
      </div>
    </div>
  );
}
