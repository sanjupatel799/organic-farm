"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Minus, Plus, ChevronLeft, Truck, Shield, RefreshCw } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { productsApi } from "@/lib/api";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const slug = params.slug as string;
    if (!slug) return;
    setLoading(true);
    productsApi.getBySlug(slug).then(async (data) => {
      setProduct(data);
      try {
        const relatedData = await productsApi.getRelated(slug);
        setRelated(relatedData);
      } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Please login to add items"); return; }
    try {
      await addItem(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse grid gap-8 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/4 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-green-900">Product not found</h1>
        <Link href="/products" className="mt-4 text-green-600 hover:text-green-700">Back to Products</Link>
      </div>
    );
  }

  const discount = product.salePrice ? calculateDiscount(product.price, product.salePrice) : 0;
  const images = product.images || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-green-500 mb-6">
        <Link href="/" className="hover:text-green-700">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-green-700">Products</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-green-700">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-green-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-green-50 to-white p-8">
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white">
                {discount}% OFF
              </span>
            )}
            {images.length > 0 ? (
              <img src={images[activeImage]?.url} alt={product.name} className="h-96 w-full object-contain" />
            ) : (
              <div className="flex h-96 items-center justify-center text-8xl font-bold text-green-200">
                {product.name.charAt(0)}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                    i === activeImage ? "border-green-500" : "border-transparent hover:border-green-200"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-green-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
              ))}
              <span className="ml-1 text-sm text-green-500">({product.rating?.toFixed(1)})</span>
            </div>
            <span className="text-sm text-green-500">
              {product.reviews?.length || 0} reviews
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold text-green-900">{formatPrice(product.salePrice)}</span>
                <span className="text-lg text-green-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-green-900">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <span className={`font-medium ${product.stock <= 5 ? "text-amber-600" : "text-green-600"}`}>
                {product.stock <= 5 ? `Only ${product.stock} left in stock` : "In Stock"}
              </span>
            ) : (
              <span className="font-medium text-red-500">Out of Stock</span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-green-700">{product.description}</p>

          {product.benefits && (
            <div className="mt-4 rounded-xl bg-green-50 p-4">
              <h3 className="font-semibold text-green-900">Benefits</h3>
              <p className="mt-1 text-sm text-green-700">{product.benefits}</p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-green-800">Quantity:</span>
                <div className="flex items-center rounded-xl border border-green-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-green-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-green-400">Max: {product.stock}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <ShoppingCart className="h-4 w-4" /> Add To Cart
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-600">
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-green-100 p-4">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, label: "Secure", desc: "100% secure checkout" },
              { icon: RefreshCw, label: "Returns", desc: "30-day return policy" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon className="mx-auto h-5 w-5 text-green-600" />
                  <p className="mt-1 text-xs font-semibold text-green-800">{item.label}</p>
                  <p className="text-[10px] text-green-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-green-100">
          {["description", "benefits", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "border-b-2 border-green-600 text-green-700" : "text-green-500 hover:text-green-700"
              }`}
            >
              {tab}
              {tab === "reviews" && ` (${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === "description" && (
            <p className="leading-relaxed text-green-700">{product.description || "No description available."}</p>
          )}
          {activeTab === "benefits" && (
            <p className="leading-relaxed text-green-700">{product.benefits || "No benefits information available."}</p>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {product.reviews?.length === 0 ? (
                <p className="text-green-500">No reviews yet. Be the first to review!</p>
              ) : (
                product.reviews?.map((review: any) => (
                  <div key={review.id} className="rounded-xl border border-green-100 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-900">{review.user?.name || "Anonymous"}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="mt-2 text-sm text-green-700">{review.comment}</p>}
                    <p className="mt-1 text-xs text-green-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-green-900">Related Products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((p: any) => (
              <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} price={p.price} salePrice={p.salePrice} rating={p.rating} stock={p.stock} image={p.images?.[0]?.url} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
