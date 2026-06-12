"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Package, ArrowRight } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      ordersApi.getById(parseInt(orderId)).then(setOrder).catch(() => {});
    }
  }, [orderId]);

  return (
    <>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-green-900">Order Placed Successfully!</h1>
      <p className="mt-2 text-green-600">
        Thank you for your order. {order && <>Your order number is <strong>{order.orderNumber}</strong></>}
      </p>

      {order && (
        <div className="mt-8 w-full max-w-md rounded-2xl border border-green-100 bg-white p-6 text-left">
          <h3 className="font-bold text-green-900">Order Details</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-green-600">Order Number</span><span className="font-medium text-green-900">{order.orderNumber}</span></div>
            <div className="flex justify-between"><span className="text-green-600">Status</span><span className="font-medium capitalize text-green-600">{order.status?.toLowerCase()}</span></div>
            <div className="flex justify-between"><span className="text-green-600">Total</span><span className="font-bold text-green-900">{formatPrice(order.total)}</span></div>
          </div>
          <div className="mt-4 space-y-2">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-green-700">{item.productName} x{item.quantity}</span>
                <span className="font-medium text-green-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link href="/account/orders" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700">
          <Package className="h-4 w-4" /> View Orders
        </Link>
        <Link href="/products" className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50">
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <Suspense fallback={<div className="animate-pulse h-20 w-20 rounded-full bg-gray-200 mx-auto" />}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
