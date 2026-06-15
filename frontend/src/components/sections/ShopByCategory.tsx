"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wheat, Droplets, Flame, Package, Apple, Droplets as Oil, Carrot } from "lucide-react";
import { categoriesApi } from "@/lib/api";
import { useScrollReveal } from "@/hooks/use-animation";

const fallbackCategories = [
  { name: "Millets", icon: Wheat, slug: "millets", color: "bg-amber-100 text-amber-700" },
  { name: "Honey", icon: Droplets, slug: "honey", color: "bg-yellow-100 text-yellow-700" },
  { name: "Spices", icon: Flame, slug: "spices", color: "bg-red-100 text-red-700" },
  { name: "Rice", icon: Package, slug: "rice", color: "bg-orange-100 text-orange-700" },
  { name: "Dry Fruits", icon: Apple, slug: "dry-fruits", color: "bg-green-100 text-green-700" },
  { name: "Oils", icon: Oil, slug: "oils", color: "bg-blue-100 text-blue-700" },
  { name: "Vegetables", icon: Carrot, slug: "vegetables", color: "bg-emerald-100 text-emerald-700" },
];

const iconMap: Record<string, any> = {
  millets: Wheat,
  honey: Droplets,
  spices: Flame,
  rice: Package,
  "dry-fruits": Apple,
  oils: Oil,
  vegetables: Carrot,
};

const colorMap: Record<string, string> = {
  millets: "bg-amber-100 text-amber-700",
  honey: "bg-yellow-100 text-yellow-700",
  spices: "bg-red-100 text-red-700",
  rice: "bg-orange-100 text-orange-700",
  "dry-fruits": "bg-green-100 text-green-700",
  oils: "bg-blue-100 text-blue-700",
  vegetables: "bg-emerald-100 text-emerald-700",
};

export default function ShopByCategory() {
  const [categories, setCategories] = useState(fallbackCategories);
  const sectionRef = useScrollReveal({ y: 30 });

  useEffect(() => {
    categoriesApi.getAll().then((data) => {
      if (data && data.length > 0) {
        setCategories(
          data.map((cat: any) => ({
            name: cat.name,
            icon: iconMap[cat.slug] || Package,
            slug: cat.slug,
            color: colorMap[cat.slug] || "bg-green-100 text-green-700",
            productCount: cat._count?.products || 0,
          }))
        );
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="bg-green-50/50 py-16" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-900 sm:text-4xl">Shop By Category</h2>
          <p className="mt-2 text-green-600">Explore our wide range of organic products</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-green-100 bg-white p-6 transition-all hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 hover:-translate-y-1 active:scale-95"
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.06}s both` }}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl transition-all group-hover:scale-110 group-hover:rotate-3 ${cat.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <span className="mt-3 text-sm font-semibold text-green-800 group-hover:text-green-600">
                  {cat.name}
                </span>
                {(cat as any).productCount !== undefined && (
                  <span className="mt-1 text-xs text-green-400">
                    {(cat as any).productCount} products
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
