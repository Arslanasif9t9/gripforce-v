import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useCart, clearCart, cartItemImage } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Grip Force" },
      { name: "description", content: "Complete your order with Grip Force. Cash on Delivery and Direct Bank Transfer available." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const inputClass =
  "w-full rounded-md border border-input bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

interface BankDetails {
  bank_name: string;
  account_title: string;
  account_number: string;
  iban: string;
  instructions?: string;
}

function CheckoutPage() {
  const cart = useCart();
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");

  // Bank Transfer receipt upload
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bank Details from DB or Fallback
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bank_name: "Meezan Bank Ltd",
    account_title: "Grip Force Store",
    account_number: "01020304050607",
    iban: "PK60MEZN0001020304050607",
    instructions: "Please transfer the total amount and upload your payment slip/screenshot below.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill user email if signed in
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  // Load bank details from store_settings
  useEffect(() => {
    async function loadBank() {
      try {
        const { data } = await supabase
          .from("store_settings")
          .select("setting_value")
          .eq("setting_key", "bank_details")
          .maybeSingle();
        if (data?.setting_value) {
          setBankDetails(data.setting_value as unknown as BankDetails);
        }
      } catch (e) {
        // use fallback
      }
    }
    loadBank();
  }, []);

  const shippingCost = cart.subtotal > 49 ? 0 : 5.0;
  const grandTotal = cart.subtotal + shippingCost;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Receipt image must be smaller than 5MB.");
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(bankDetails.account_number);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.lines.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorMessage("Please fill in all required shipping fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedReceiptUrl: string | null = null;

      // Agar Bank Transfer hai aur user ne receipt upload ki hai
      if (paymentMethod === "bank_transfer" && receiptFile) {
        const fileExt = receiptFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("payment-receipts")
          .upload(fileName, receiptFile);

        if (uploadErr) {
          console.warn("Receipt upload issue:", uploadErr);
        } else if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("payment-receipts")
            .getPublicUrl(uploadData.path);
          uploadedReceiptUrl = publicUrlData.publicUrl;
        }
      }

      // Unique Order Number: e.g. GF-849201
      const orderNumber = `GF-${Math.floor(100000 + Math.random() * 900000)}`;

      // Prepare order items
      const orderItems = cart.lines.map((line) => ({
        product_slug: line.product.slug,
        product_name: `${line.product.name}${line.size ? ` (${line.size})` : ""}`,
        quantity: line.qty,
        unit_price: line.product.price,
        line_total: line.product.price * line.qty,
      }));

      // Call secure database function (No RLS issues!)
      const { data: rpcRes, error: rpcErr } = await supabase.rpc("create_customer_order", {
        p_order_number: orderNumber,
        p_customer_name: fullName.trim(),
        p_customer_email: email.trim().toLowerCase(),
        p_customer_phone: phone.trim(),
        p_shipping_address: {
          address: address.trim(),
          city: city.trim(),
          notes: notes.trim(),
          payment_method: paymentMethod,
        },
        p_subtotal: cart.subtotal,
        p_shipping_total: shippingCost,
        p_total: grandTotal,
        p_receipt_url: uploadedReceiptUrl,
        p_items: orderItems,
      });

      if (rpcErr) throw rpcErr;

      // Cart clear karein aur order success par redirect karein
      clearCart();
      navigate({
        to: "/order-success",
        search: { order: orderNumber },
      });
    } catch (err: any) {
      console.error("Order error:", err);
      setErrorMessage(err.message || "Failed to place your order. Please check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="heading-section">Your Cart is Empty</h1>
        <p className="mt-3 text-muted-foreground">Add some Grip Force training gear before proceeding to checkout.</p>
        <Link to="/shop" className="btn-neon mt-6 inline-block">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="heading-section">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your delivery details and choose your preferred payment method.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid gap-8 lg:grid-cols-12">
        {/* Left: Shipping Form & Payment */}
        <div className="space-y-6 lg:col-span-7">
          {/* Shipping Information */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wider text-foreground">
              1. Delivery Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Babar Azam"
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300 1234567"
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground">
                  Street Address <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Apartment #, Street name, Area"
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  City <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Order Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for courier"
                  className={`mt-1 ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wider text-foreground">
              2. Payment Method
            </h2>

            <div className="mt-4 space-y-3">
              {/* Option: COD */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface-2 hover:border-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium text-foreground">Cash on Delivery (COD)</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Pay with cash when your parcel is delivered to your doorstep.
                  </p>
                </div>
              </label>

              {/* Option: Bank Transfer */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface-2 hover:border-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">Direct Bank Transfer</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Transfer directly from your banking app and upload your receipt screenshot.
                  </p>
                </div>
              </label>

              {/* Bank Transfer Details & Receipt Upload */}
              {paymentMethod === "bank_transfer" && (
                <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
                  <p className="font-display uppercase tracking-wide text-primary">Bank Account Details</p>
                  <p className="mt-1 text-xs text-muted-foreground">{bankDetails.instructions}</p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <p><strong className="text-foreground">Bank:</strong> {bankDetails.bank_name}</p>
                    <p><strong className="text-foreground">Account Title:</strong> {bankDetails.account_title}</p>
                    <div className="flex items-center gap-2">
                      <p><strong className="text-foreground">Account Number:</strong> {bankDetails.account_number}</p>
                      <button
                        type="button"
                        onClick={copyNumber}
                        className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase font-bold text-primary hover:bg-primary/20"
                      >
                        {copiedAccount ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    {bankDetails.iban && (
                      <p><strong className="text-foreground">IBAN:</strong> {bankDetails.iban}</p>
                    )}
                  </div>

                  {/* Screenshot / Slip Upload Input */}
                  <div className="mt-4 border-t border-primary/20 pt-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                      Upload Payment Slip / Screenshot
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      Upload a screenshot or photo of your successful transfer slip (JPG or PNG, max 5MB).
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="mt-2 block w-full text-xs text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-display file:text-xs file:uppercase file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                    />

                    {receiptPreview && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={receiptPreview}
                          alt="Payment Receipt Preview"
                          className="size-16 rounded border border-border object-cover"
                        />
                        <span className="text-xs text-primary font-medium">Receipt attached ready to upload</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wider text-foreground">
              Order Summary ({cart.count})
            </h2>

            {/* Line items list */}
            <div className="mt-4 max-h-60 space-y-3 overflow-y-auto divide-y divide-border/50 pr-1">
              {cart.lines.map((line) => (
                <div key={`${line.product.slug}-${line.size ?? "def"}`} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={cartItemImage(line)}
                    alt={line.product.name}
                    className="size-12 rounded-md object-cover bg-surface-2"
                  />

                  <div className="flex-1 text-xs">
                    <p className="font-medium text-foreground">{line.product.name}</p>
                    {line.size && <p className="text-muted-foreground">Size: {line.size}</p>}
                    <p className="text-muted-foreground">Qty: {line.qty}</p>
                  </div>
                  <div className="text-right text-xs font-semibold text-foreground">
                    ${(line.product.price * line.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
                <span>Total</span>
                <span className="font-display text-xl text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-neon mt-6 w-full py-3 text-center text-sm disabled:opacity-60"
            >
              {isSubmitting ? "Placing Order…" : `Place Order • $${grandTotal.toFixed(2)}`}
            </button>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              By placing your order, you agree to Grip Force's terms of service and return policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
