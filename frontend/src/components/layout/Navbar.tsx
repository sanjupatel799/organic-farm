"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import {
  Leaf,
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-green-600" />
          <span className="text-xl font-bold tracking-tight text-green-800">
            Organic<span className="text-amber-600">Farm</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-green-600"
                  : "text-green-800/80 hover:text-green-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-full p-2 text-green-700 transition-colors hover:bg-green-50"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {isAuthenticated ? (
            <>
              <Link
                href="/account/wishlist"
                className="hidden rounded-full p-2 text-green-700 transition-colors hover:bg-green-50 sm:block"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="relative rounded-full p-2 text-green-700 transition-colors hover:bg-green-50"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/account"
                  className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
                >
                  {user?.name?.split(" ")[0] || "Account"}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 sm:block"
            >
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Login
              </span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 text-green-700 transition-colors hover:bg-green-50 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-green-100 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-green-50 text-green-600"
                    : "text-green-800 hover:bg-green-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-green-100" />
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50"
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg border border-green-200 px-3 py-2 text-center text-sm font-medium text-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-green-100 bg-green-50/50 px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search organic products..."
                  className="w-full rounded-full border border-green-200 bg-white py-2.5 pl-10 pr-4 text-sm text-green-900 placeholder-green-400 outline-none ring-green-300 focus:ring-2"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
