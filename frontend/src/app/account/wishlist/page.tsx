"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { wishlistApi } from "@/lib/api";
import ProductCard from "@/components/shared/ProductCard";

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    wishlistApi.get().then((data: any) => {
      setItems(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  if (loading) return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="animate-pulse grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[...Array(4)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-gray-100" />)}</div></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="text-2xl font-bold text-green-900">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 text-green-300" />
          <p className="mt-4 text-lg font-semibold text-green-800">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-green-500">Save your favorite products here</p>
          <Link href="/products" className="mt-4 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item: any) => (
            <div key={item.id} className="relative">
              <ProductCard
                id={item.product.id}
                name={item.product.name}
                slug={item.product.slug}
                price={item.product.price}
                salePrice={item.product.salePrice}
                rating={item.product.rating}
                stock={item.product.stock}
                image={item.product.images?.[0]?.url}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
