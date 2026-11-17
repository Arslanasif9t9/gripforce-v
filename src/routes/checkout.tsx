import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { clearCart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Grip Force" },
      { name: "description", content: "Complete your order for premium Grip Force gym & fitness accessories." },
      { property: "og:title", content: "Checkout — Grip Force" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

type PaymentMethod = "cod" | "bank_transfer";

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Agar cart khali ho to user ko cart par bhej dein
  if (cart.lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="heading-section">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Add items before proceeding to checkout.</p>
        <Link to="/shop" className="btn-neon mt-6 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  const shippingCost = 0; // Free shipping
  const grandTotal = cart.subtotal + shippingCost;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorMessage("Please fill in all required shipping fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Unique Order Number: e.g. GF-849201
      const orderNumber = `GF-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Insert Order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: fullName.trim(),
          customer_email: email.trim().toLowerCase(),
          customer_phone: phone.trim(),
          shipping_address: {
            address: address.trim(),
            city: city.trim(),
            notes: notes.trim(),
            payment_method: paymentMethod,
          },
          status: "pending",
          subtotal: cart.subtotal,
          shipping_total: shippingCost,
          total: grandTotal,
        })
        .select("id, order_number")
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      const orderItemsToInsert = cart.lines.map((line) => ({
        order_id: orderData.id,
        product_slug: line.product.slug,
        product_name: `${line.product.name}${line.size ? ` (${line.size})` : ""}`,
        quantity: line.qty,
        unit_price: line.product.price,
        line_total: line.product.price * line.qty,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Clear Cart & Redirect to Order Success Screen
      clearCart();
      navigate({
        to: "/order-success",
        search: { order: orderData.order_number },
      });
    } catch (err: any) {
      console.error("Order placement failed:", err);
      setErrorMessage(
        err.message || "Failed to place your order. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Cart
        </Link>
        <h1 className="heading-section mt-2">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your delivery details to complete your Grip Force order.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping Form & Payment Selection */}
        <form onSubmit={handlePlaceOrder} className="space-y-6 lg:col-span-2">
          {/* Customer Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground">
              1. Delivery Information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat / Street address"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore / Karachi / Islamabad"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Order Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for rider"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground">
              2. Payment Method
            </h2>

            <div className="mt-4 space-y-3">
              {/* COD Option */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-semibold text-foreground">Cash on Delivery (COD)</div>
                  <div className="text-xs text-muted-foreground">
                    Pay with cash directly to the courier rider upon receiving your package.
                  </div>
                </div>
              </label>

              {/* Bank Transfer Option */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-semibold text-foreground">Direct Bank Transfer / Raast</div>
                  <div className="text-xs text-muted-foreground">
                    Transfer funds directly to our business bank account. Order is dispatched upon confirmation.
                  </div>
                </div>
              </label>

              {paymentMethod === "bank_transfer" && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-xs text-foreground">
                  <div className="font-semibold uppercase tracking-wider text-primary">Bank Details:</div>
                  <div className="mt-2 space-y-1 font-mono text-[11px]">
                    <div>Bank: Meezan Bank Ltd</div>
                    <div>Account Title: Grip Force Fitness</div>
                    <div>Account Number: 01020304050607</div>
                    <div>IBAN: PK60MEZN0001020304050607</div>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Please send your transfer receipt screenshot on WhatsApp after placing the order.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-neon w-full py-4 text-lg font-bold tracking-wide disabled:opacity-50"
          >
            {isSubmitting ? "Processing Order..." : `Place Order • ${formatPrice(grandTotal)}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl uppercase tracking-wide text-foreground">
            Order Summary
          </h2>

          <ul className="mt-4 divide-y divide-border">
            {cart.lines.map((line) => (
              <li key={`${line.product.id}-${line.size || "std"}`} className="py-3 text-sm">
                <div className="flex justify-between">
                  <div className="font-medium text-foreground">
                    {line.product.name}
                    {line.size && (
                      <span className="ml-1 text-xs text-muted-foreground">({line.size})</span>
                    )}
                  </div>
                  <div className="text-right text-foreground">
                    {formatPrice(line.product.price * line.qty)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Qty: {line.qty} × {formatPrice(line.product.price)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-base text-foreground">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-primary font-medium">FREE</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-display text-lg uppercase text-foreground">Total</span>
              <span className="font-display text-xl text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
