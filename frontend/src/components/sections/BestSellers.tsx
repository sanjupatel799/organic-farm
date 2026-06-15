"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { productsApi } from "@/lib/api";
import { useScrollReveal } from "@/hooks/use-animation";

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal({ y: 30 });

  useEffect(() => {
    productsApi.getBestSellers().then((data) => {
      setProducts(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-green-50/50 py-16" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-green-900 sm:text-4xl">Best Sellers</h2>
            <p className="mt-2 text-green-600">Most loved products by our customers</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="rounded-full border border-green-200 p-2 text-green-600 transition-all hover:bg-green-50 hover:scale-110 active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="rounded-full border border-green-200 p-2 text-green-600 transition-all hover:bg-green-50 hover:scale-110 active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              href="/products?sort=rating"
              className="ml-2 flex items-center gap-1 text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-gray-100 p-4">
                <div className="h-48 rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                <div className="mt-2 h-6 w-1/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mt-8">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-green-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-green-50 to-transparent" />

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.slice(0, 8).map((product: any, i: number) => (
                <div
                  key={product.id}
                  className="min-w-[280px] shrink-0 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`,
                  }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    salePrice={product.salePrice}
                    rating={product.rating}
                    stock={product.stock}
                    image={product.images?.[0]?.url}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products?sort=rating"
            className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

    </section>
  );
}
