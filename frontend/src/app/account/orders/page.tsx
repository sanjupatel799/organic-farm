"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { ordersApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    ordersApi.getMyOrders().then((data: any) => {
      const items = data.orders || data || [];
      setOrders(Array.isArray(items) ? items : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-100" />)}</div></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="text-2xl font-bold text-green-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-16 w-16 text-green-300" />
          <p className="mt-4 text-lg font-semibold text-green-800">No orders yet</p>
          <Link href="/products" className="mt-4 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="rounded-2xl border border-green-100 bg-white p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-green-900">{order.orderNumber}</p>
                  <p className="mt-0.5 text-sm text-green-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                  {order.status?.toLowerCase()}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {order.items?.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-green-700">{item.productName} x{item.quantity}</span>
                    <span className="font-medium text-green-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && <p className="text-xs text-green-400">+{order.items.length - 3} more items</p>}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-green-100 pt-4">
                <span className="font-bold text-green-900">Total: {formatPrice(order.total)}</span>
                {order.status === "PENDING" && (
                  <button onClick={() => ordersApi.cancel(order.id).then(() => window.location.reload())}
                    className="text-sm text-red-500 hover:text-red-600">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
