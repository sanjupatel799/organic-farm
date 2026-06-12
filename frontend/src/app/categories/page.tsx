"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wheat, Droplets, Flame, Package, Apple, Droplets as Oil, Carrot, ArrowRight } from "lucide-react";
import { categoriesApi } from "@/lib/api";

const iconMap: Record<string, any> = {
  millets: Wheat, honey: Droplets, spices: Flame, rice: Package,
  "dry-fruits": Apple, oils: Oil, vegetables: Carrot,
};

const colorMap: Record<string, string> = {
  millets: "bg-amber-100 text-amber-700", honey: "bg-yellow-100 text-yellow-700",
  spices: "bg-red-100 text-red-700", rice: "bg-orange-100 text-orange-700",
  "dry-fruits": "bg-green-100 text-green-700", oils: "bg-blue-100 text-blue-700",
  vegetables: "bg-emerald-100 text-emerald-700",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi.getAll().then((data) => {
      setCategories(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-900 sm:text-4xl">Categories</h1>
        <p className="mt-2 text-green-600">Browse our product categories</p>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 p-8 h-40" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat: any) => {
            const Icon = iconMap[cat.slug] || Package;
            const color = colorMap[cat.slug] || "bg-green-100 text-green-700";
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex items-center gap-6 rounded-2xl border border-green-100 bg-white p-6 transition-all hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50"
              >
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 group-hover:text-green-600">{cat.name}</h3>
                  <p className="mt-1 text-sm text-green-500 line-clamp-2">{cat.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    Shop Now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
