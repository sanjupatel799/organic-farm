"use client";

import Link from "next/link";
import { ArrowRight, Sprout, Wheat, Droplets, FlaskRoundIcon as Flask } from "lucide-react";

const products = [
  { name: "Turmeric", icon: Sprout, color: "bg-amber-100 text-amber-700" },
  { name: "Honey", icon: Droplets, color: "bg-yellow-100 text-yellow-700" },
  { name: "Millets", icon: Wheat, color: "bg-orange-100 text-orange-700" },
  { name: "Cold Pressed Oils", icon: Flask, color: "bg-green-100 text-green-700" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
              <Sprout className="h-4 w-4" />
              <span>100% Certified Organic</span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-green-900 sm:text-5xl lg:text-6xl">
              Fresh From Nature
              <span className="block text-amber-600">Delivered To Your Home</span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-green-700/80 lg:mx-0">
              Discover the purest organic products sourced directly from local farms.
              Naturally grown, chemical-free, and packed with goodness.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-700 hover:shadow-green-300"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full border-2 border-green-200 px-8 py-3 text-sm font-semibold text-green-700 transition-all hover:border-green-300 hover:bg-green-50"
              >
                Explore Categories
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <span
                    key={product.name}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${product.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {product.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-96 w-96">
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <img
                  src="/images/general/hero-farm.jpg"
                  alt="Organic Farm"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-4 rounded-full bg-white/50 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Sprout className="mx-auto h-16 w-16 text-green-700" />
                  <div className="mt-3 space-y-1">
                    {[
                      { label: "Organic", value: "100%" },
                      { label: "Natural", value: "Pure" },
                      { label: "Fresh", value: "Farm" },
                    ].map((item) => (
                      <p key={item.label} className="text-sm text-green-800">
                        <span className="font-bold text-green-900">{item.value}</span>{" "}
                        <span className="text-green-600">{item.label}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
