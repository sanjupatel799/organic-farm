"use client";

import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    ordersApi.getAll({ page, limit: 10 }).then((data) => {
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await ordersApi.updateStatus(id, status);
      toast.success(`Order status updated to ${status.toLowerCase()}`);
      fetchOrders();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">{total} orders total</p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />)}</div>
        ) : (
          orders.map((order: any) => (
            <div key={order.id} className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="text-sm text-green-600 hover:text-green-700">
                    {expandedId === order.id ? "Hide" : "View"}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                <span className="text-gray-500">{order.items?.length || 0} items</span>
              </div>

              {expandedId === order.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-900">{item.productName} x{item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {order.payments?.[0] && (
                    <p className="text-xs text-gray-400">Payment: {order.payments[0].method} - {order.payments[0].status}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
        <span className="self-center text-sm text-gray-500">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
}
