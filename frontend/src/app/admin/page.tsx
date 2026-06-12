"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-100" />)}</div>;

  const stats = [
    { label: "Total Revenue", value: formatPrice(data?.totalRevenue || 0), icon: DollarSign, color: "bg-green-100 text-green-700" },
    { label: "Total Orders", value: data?.totalOrders || 0, icon: ShoppingCart, color: "bg-blue-100 text-blue-700" },
    { label: "Products", value: data?.totalProducts || 0, icon: Package, color: "bg-amber-100 text-amber-700" },
    { label: "Customers", value: data?.totalCustomers || 0, icon: Users, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Your organic farm at a glance</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <div className="mt-4 space-y-3">
            {data?.recentOrders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-gray-500">{order.user?.name}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>{order.status?.toLowerCase()}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/orders" className="mt-4 inline-flex text-sm text-green-600 hover:text-green-700">View All Orders →</Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="font-bold text-gray-900">Inventory Alerts</h3>
          {data?.lowStockProducts?.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-gray-900">{product.name}</span>
                  </div>
                  <span className="font-medium text-amber-600">{product.stock} left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">All products are well-stocked ✓</p>
          )}
        </div>
      </div>
    </div>
  );
}
