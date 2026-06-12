"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { formatPrice } from "@/lib/utils";
import { couponsApi } from "@/lib/api";
import { toast } from "sonner";

export default function CartPage() {
  const { items, fetchCart, updateItem, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discount = coupon
    ? coupon.discountType === "PERCENTAGE"
      ? (subtotal * coupon.discount) / 100
      : coupon.discount
    : 0;

  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const data = await couponsApi.validate(couponCode, subtotal);
      setCoupon(data);
      toast.success(`Coupon applied! ${data.discount}% off`);
    } catch (error: any) {
      toast.error(error.message || "Invalid coupon");
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="h-16 w-16 text-green-300" />
        <h1 className="mt-4 text-2xl font-bold text-green-900">Please Login</h1>
        <p className="mt-2 text-green-600">You need to login to view your cart</p>
        <Link href="/login" className="mt-6 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="h-16 w-16 text-green-300" />
        <h1 className="mt-4 text-2xl font-bold text-green-900">Your Cart is Empty</h1>
        <p className="mt-2 text-green-600">Start shopping for organic products</p>
        <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700">
          Shop Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-green-900 sm:text-3xl">Shopping Cart</h1>
      <p className="mt-1 text-sm text-green-500">{items.length} items</p>

      <div className="mt-8 space-y-4">
        {items.map((item) => {
          const price = item.product.salePrice || item.product.price;
          return (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-4">
              <Link href={`/products/${item.product.slug}`}>
                <div className="h-20 w-20 shrink-0 rounded-xl bg-green-50 p-2">
                  {item.product.images?.[0]?.url ? (
                    <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-bold text-green-200">{item.product.name.charAt(0)}</div>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-semibold text-green-900 line-clamp-1 hover:text-green-600">{item.product.name}</h3>
                </Link>
                <p className="mt-0.5 text-sm text-green-600">{formatPrice(price)} each</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-green-200">
                    <button onClick={() => item.quantity > 1 && updateItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1} className="p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-green-900">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock} className="p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button onClick={() => { removeItem(item.id); toast.success("Item removed"); }}
                    className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-green-900">{formatPrice(price * item.quantity)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon */}
      <div className="mt-6 flex gap-3">
        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code" className="flex-1 rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
        <button onClick={applyCoupon} disabled={couponLoading}
          className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
          {couponLoading ? "..." : "Apply"}
        </button>
      </div>
      {coupon && <p className="mt-2 text-sm text-green-600">Coupon applied: {coupon.code} ({coupon.discount}{coupon.discountType === "PERCENTAGE" ? "%" : "$"} off)</p>}

      {/* Summary */}
      <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6">
        <h2 className="font-bold text-green-900">Order Summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-green-600">Subtotal</span><span className="font-medium text-green-900">{formatPrice(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="font-medium text-green-600">-{formatPrice(discount)}</span></div>}
          <div className="flex justify-between"><span className="text-green-600">Shipping</span><span className="font-medium text-green-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <hr className="border-green-100" />
          <div className="flex justify-between text-base"><span className="font-bold text-green-900">Total</span><span className="font-bold text-green-900">{formatPrice(total)}</span></div>
        </div>
        <Link href="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700">
          Proceed to Checkout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
