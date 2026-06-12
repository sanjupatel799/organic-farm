"use client";

import Link from "next/link";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  rating: number;
  stock?: number;
  image?: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  salePrice,
  rating,
  stock,
  image,
}: ProductCardProps) {
  const discount = salePrice ? calculateDiscount(price, salePrice) : 0;
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    setIsAdding(true);
    try {
      await addItem(id, 1);
      toast.success(`${name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <div className="group relative rounded-2xl border border-green-100 bg-white transition-all hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {discount}% OFF
          </span>
        )}
        {stock !== undefined && stock <= 5 && stock > 0 && (
          <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Only {stock} left
          </span>
        )}
        {stock === 0 && (
          <span className="rounded-full bg-gray-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Out of stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur transition-all hover:bg-white ${
          isWishlisted ? "text-rose-500 opacity-100" : "text-green-600 opacity-0 group-hover:opacity-100"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
      </button>

      {/* Image */}
      <Link href={`/products/${slug}`}>
        <div className="flex h-52 items-center justify-center rounded-t-2xl bg-gradient-to-b from-green-50 to-white p-6">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-6xl font-bold text-green-200">{name.charAt(0)}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="text-sm font-semibold text-green-900 line-clamp-1 hover:text-green-600">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-green-500">({rating.toFixed(1)})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-lg font-bold text-green-900">
                {formatPrice(salePrice)}
              </span>
              <span className="text-sm text-green-400 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-green-900">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || stock === 0}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
            stock === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {stock === 0 ? "Out of Stock" : isAdding ? "Adding..." : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
