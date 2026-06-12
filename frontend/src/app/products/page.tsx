"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { productsApi, categoriesApi } from "@/lib/api";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rating = searchParams.get("rating") || "";

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (updates.category !== undefined || updates.search !== undefined) params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort && sort !== "newest") params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (rating) params.rating = rating;

    Promise.all([
      productsApi.getAll(params),
      categoriesApi.getAll().catch(() => []),
    ]).then(([prodData, catData]) => {
      setProducts(prodData.products || []);
      setTotal(prodData.total || 0);
      setTotalPages(prodData.totalPages || 1);
      setCategories(catData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, search, sort, page, minPrice, maxPrice, rating]);

  const clearFilters = () => router.push("/products");
  const hasFilters = category || search || minPrice || maxPrice || rating;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900 sm:text-3xl">
            {category ? categories.find((c: any) => c.slug === category)?.name || category : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-green-500">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
              <X className="h-4 w-4" /> Clear
            </button>
          )}
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-xl border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="relative">
            <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })}
              className="appearance-none rounded-xl border border-green-200 bg-white px-4 py-2 pr-10 text-sm text-green-700 outline-none">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); updateParams({ search: fd.get("search") as string }); }}
          className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
          <input name="search" defaultValue={search} placeholder="Search products..."
            className="w-full rounded-xl border border-green-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-green-300 focus:ring-2" />
        </form>
      </div>

      <div className="mt-6 flex gap-8">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
          <div className="rounded-2xl border border-green-100 bg-white p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-green-900">Categories</h3>
              <div className="mt-3 space-y-2">
                <button onClick={() => updateParams({ category: "" })}
                  className={`block text-sm ${!category ? "text-green-600 font-medium" : "text-green-600 hover:text-green-700"}`}>All</button>
                {categories.map((cat: any) => (
                  <button key={cat.id} onClick={() => updateParams({ category: cat.slug })}
                    className={`block text-sm ${category === cat.slug ? "text-green-600 font-medium" : "text-green-600 hover:text-green-700"}`}>
                    {cat.name} ({cat._count?.products || 0})
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Price Range</h3>
              <div className="mt-3 flex gap-2">
                <input type="number" placeholder="Min" value={minPrice}
                  onChange={(e) => updateParams({ minPrice: e.target.value, page: "1" })}
                  className="w-full rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
                <span className="text-green-400 self-center">-</span>
                <input type="number" placeholder="Max" value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value, page: "1" })}
                  className="w-full rounded-lg border border-green-200 px-3 py-2 text-sm outline-none" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Minimum Rating</h3>
              <div className="mt-3 flex gap-2">
                {[4, 3, 2].map((r) => (
                  <button key={r} onClick={() => updateParams({ rating: rating === String(r) ? "" : String(r) })}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${rating === String(r) ? "bg-green-600 text-white border-green-600" : "border-green-200 text-green-700 hover:bg-green-50"}`}>
                    {r}+ ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-gray-100 p-4">
                  <div className="h-48 rounded-xl bg-gray-200" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                  <div className="mt-2 h-6 w-1/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-semibold text-green-800">No products found</p>
              <p className="mt-1 text-sm text-green-500">Try adjusting your filters</p>
              <button onClick={clearFilters} className="mt-4 rounded-xl bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product: any) => (
                  <ProductCard key={product.id} id={product.id} name={product.name} slug={product.slug}
                    price={product.price} salePrice={product.salePrice} rating={product.rating}
                    stock={product.stock} image={product.images?.[0]?.url} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button onClick={() => updateParams({ page: String(page - 1) })} disabled={page <= 1}
                    className="rounded-xl border border-green-200 p-2 text-green-600 hover:bg-green-50 disabled:opacity-50">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => updateParams({ page: String(p) })}
                      className={`rounded-xl px-4 py-2 text-sm font-medium ${p === page ? "bg-green-600 text-white" : "border border-green-200 text-green-700 hover:bg-green-50"}`}>{p}</button>
                  ))}
                  <button onClick={() => updateParams({ page: String(page + 1) })} disabled={page >= totalPages}
                    className="rounded-xl border border-green-200 p-2 text-green-600 hover:bg-green-50 disabled:opacity-50">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 p-4">
              <div className="h-48 rounded-xl bg-gray-200" />
              <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
              <div className="mt-2 h-6 w-1/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
