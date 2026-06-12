"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Heart, MapPin, User, DollarSign, ShoppingBag, LogOut, LayoutDashboard, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { ordersApi, wishlistApi } from "@/lib/api";

export default function AccountDashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    ordersApi.getMyOrders().then((data: any) => {
      const orders = data.orders || data || [];
      setStats((s) => ({ ...s, orders: Array.isArray(orders) ? orders.length : 0 }));
    }).catch(() => {});
    wishlistApi.get().then((data: any) => {
      setStats((s) => ({ ...s, wishlist: data?.length || 0 }));
    }).catch(() => {});
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const cards = [
    { label: "Total Orders", value: stats.orders, icon: Package, href: "/account/orders", color: "bg-blue-100 text-blue-700" },
    { label: "Wishlist", value: stats.wishlist, icon: Heart, href: "/account/wishlist", color: "bg-rose-100 text-rose-700" },
    { label: "My Profile", value: "Edit", icon: User, href: "/account/profile", color: "bg-green-100 text-green-700" },
    { label: "Addresses", value: "Manage", icon: MapPin, href: "/account/address", color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">My Account</h1>
          <p className="mt-1 text-green-600">Welcome back, {user.name}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}
              className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-6 transition-all hover:border-green-200 hover:shadow-md">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-green-600">{card.label}</p>
                <p className="text-xl font-bold text-green-900">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="flex items-center justify-between rounded-2xl border border-green-100 bg-white p-6 transition-all hover:border-green-200 hover:shadow-md">
          <span className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">My Orders</span>
          </span>
          <ArrowRight className="h-4 w-4 text-green-400" />
        </Link>
        <Link href="/account/wishlist" className="flex items-center justify-between rounded-2xl border border-green-100 bg-white p-6 transition-all hover:border-green-200 hover:shadow-md">
          <span className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="font-medium text-green-900">My Wishlist</span>
          </span>
          <ArrowRight className="h-4 w-4 text-green-400" />
        </Link>
      </div>
    </div>
  );
}
