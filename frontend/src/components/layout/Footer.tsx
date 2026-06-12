import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, Globe, Camera, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-400" />
              <span className="text-lg font-bold text-white">
                Organic<span className="text-amber-400">Farm</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-green-300 leading-relaxed">
              Fresh from nature, delivered to your home. 100% organic products for a healthier life.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "About Us", href: "/about" },
                { label: "Blogs", href: "/blogs" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-green-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: "Millets", slug: "millets" },
                { label: "Honey", slug: "honey" },
                { label: "Spices", slug: "spices" },
                { label: "Rice", slug: "rice" },
                { label: "Dry Fruits", slug: "dry-fruits" },
                { label: "Oils", slug: "oils" },
                { label: "Vegetables", slug: "vegetables" },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/products?category=${item.slug}`}
                    className="text-sm text-green-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-green-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span>123 Organic Lane, Farmville, Nature County</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-green-300">
                <Phone className="h-4 w-4 shrink-0 text-green-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-green-300">
                <Mail className="h-4 w-4 shrink-0 text-green-400" />
                <span>hello@organicfarm.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-green-800 pt-6 text-center">
          <p className="text-xs text-green-400">
            &copy; {new Date().getFullYear()} Organic Farm. All rights reserved. Fresh & Organic Since 2024.
          </p>
        </div>
      </div>
    </footer>
  );
}
