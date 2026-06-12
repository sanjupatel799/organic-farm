"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, CreditCard, Smartphone, Building, Banknote, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { formatPrice } from "@/lib/utils";
import { addressesApi, ordersApi } from "@/lib/api";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "UPI", label: "UPI", icon: Smartphone },
  { id: "CARD", label: "Card", icon: CreditCard },
  { id: "RAZORPAY", label: "Razorpay", icon: Building },
  { id: "COD", label: "Cash on Delivery", icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [step, setStep] = useState<"address" | "payment" | "review">("address");
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  // New address form
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: true,
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([
      addressesApi.getAll().catch(() => []),
      fetchCart(),
    ]).then(([addrs]) => {
      setAddresses(addrs || []);
      const defaultAddr = (addrs || []).find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated, fetchCart]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  const handleAddAddress = async () => {
    try {
      const addr = await addressesApi.create(newAddress);
      setAddresses((prev) => [...prev, addr]);
      setSelectedAddressId(addr.id);
      setShowNewForm(false);
      toast.success("Address added!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { toast.error("Please select an address"); return; }
    setPlacing(true);
    try {
      const order = await ordersApi.create({
        addressId: selectedAddressId,
        paymentMethod,
      });
      toast.success("Order placed successfully!");
      router.push(`/order-success?id=${order.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold text-green-900">Please Login</h1>
      <p className="mt-2 text-green-600">Login to proceed with checkout</p>
      <Link href="/login" className="mt-6 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700">Login</Link>
    </div>;
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-gray-100" />)}</div></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-green-900 sm:text-3xl">Checkout</h1>

      {/* Steps */}
      <div className="mt-8 flex items-center gap-3 text-sm">
        {["address", "payment", "review"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step === s ? "bg-green-600 text-white" : i < ["address", "payment", "review"].indexOf(step) ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
            }`}>{i + 1}</div>
            <span className={`capitalize ${step === s ? "font-semibold text-green-900" : "text-gray-500"}`}>{s}</span>
            {i < 2 && <div className="h-px w-8 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Step */}
          {step === "address" && (
            <div>
              <h2 className="text-lg font-bold text-green-900">Shipping Address</h2>
              <div className="mt-4 space-y-3">
                {addresses.map((addr: any) => (
                  <label key={addr.id} className={`flex cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedAddressId === addr.id ? "border-green-500 bg-green-50" : "border-green-100 hover:border-green-200"
                  }`}>
                    <input type="radio" name="address" checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)} className="mt-1 accent-green-600" />
                    <div className="ml-3">
                      <p className="font-medium text-green-900">{addr.name} - {addr.phone}</p>
                      <p className="text-sm text-green-600">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>

              {showNewForm ? (
                <div className="mt-4 rounded-xl border border-green-100 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Name" value={newAddress.name} onChange={(e) => setNewAddress((f) => ({ ...f, name: e.target.value }))} className="col-span-2 rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                    <input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress((f) => ({ ...f, phone: e.target.value }))} className="rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                    <input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress((f) => ({ ...f, pincode: e.target.value }))} className="rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                    <input placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress((f) => ({ ...f, address: e.target.value }))} className="col-span-2 rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                    <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress((f) => ({ ...f, city: e.target.value }))} className="rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                    <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress((f) => ({ ...f, state: e.target.value }))} className="rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddAddress} className="rounded-xl bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700">Save Address</button>
                    <button onClick={() => setShowNewForm(false)} className="rounded-xl border border-green-200 px-6 py-2 text-sm text-green-700 hover:bg-green-50">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowNewForm(true)} className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700">
                  + Add New Address
                </button>
              )}

              <div className="mt-6 flex justify-end">
                <button onClick={() => setStep("payment")} disabled={!selectedAddressId}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div>
              <h2 className="text-lg font-bold text-green-900">Payment Method</h2>
              <div className="mt-4 space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label key={method.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                      paymentMethod === method.id ? "border-green-500 bg-green-50" : "border-green-100 hover:border-green-200"
                    }`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)} className="accent-green-600" />
                      <Icon className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">{method.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep("address")} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={() => setStep("review")} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700">
                  Review Order <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div>
              <h2 className="text-lg font-bold text-green-900">Review Your Order</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => {
                  const price = item.product.salePrice || item.product.price;
                  return (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-green-100 p-3">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-green-50 p-1">
                        {item.product.images?.[0]?.url ? <img src={item.product.images[0].url} alt="" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center text-lg font-bold text-green-200">{item.product.name.charAt(0)}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-green-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-green-900">{formatPrice(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              {selectedAddressId && (
                <div className="mt-4 rounded-xl border border-green-100 p-4">
                  <h3 className="text-sm font-semibold text-green-900">Shipping To</h3>
                  {(() => { const a = addresses.find((ad: any) => ad.id === selectedAddressId); return a ? <p className="mt-1 text-sm text-green-600">{a.name}, {a.address}, {a.city}, {a.state} - {a.pincode}</p> : null; })()}
                </div>
              )}

              <div className="mt-4 rounded-xl border border-green-100 p-4">
                <p className="text-sm font-medium text-green-900">Payment: <span className="font-normal text-green-600">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod}</span></p>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep("payment")} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placing}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-10 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                  {placing ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing...</> : <>Place Order <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-green-100 bg-white p-6">
            <h3 className="font-bold text-green-900">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-green-600">Items ({items.length})</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-green-600">Shipping</span><span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <hr className="border-green-100 my-2" />
              <div className="flex justify-between text-base"><span className="font-bold text-green-900">Total</span><span className="font-bold text-green-900">{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
