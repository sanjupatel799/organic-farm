"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sprout, Wheat, Droplets, FlaskRoundIcon as Flask, Leaf } from "lucide-react";
import gsap from "gsap";

const heroSlides = [
  {
    image: "/images/general/hero-farm.jpg",
    title: "Fresh From Nature",
    subtitle: "Delivered To Your Home",
    desc: "Discover the purest organic products sourced directly from local farms. Naturally grown, chemical-free, and packed with goodness.",
  },
  {
    image: "/images/general/hero-farm.jpg",
    title: "100% Certified Organic",
    subtitle: "Trusted Quality Since 2010",
    desc: "Every product is carefully selected and certified organic. We partner with local farmers who share our commitment to sustainable agriculture.",
  },
  {
    image: "/images/general/hero-farm.jpg",
    title: "From Farm to Table",
    subtitle: "Nature's Best Selection",
    desc: "Experience the difference of farm-fresh organic produce. We deliver nature's bounty straight from the fields to your doorstep.",
  },
];

const products = [
  { name: "Turmeric", icon: Sprout, color: "bg-amber-100 text-amber-700" },
  { name: "Honey", icon: Droplets, color: "bg-yellow-100 text-yellow-700" },
  { name: "Millets", icon: Wheat, color: "bg-orange-100 text-orange-700" },
  { name: "Cold Pressed Oils", icon: Flask, color: "bg-green-100 text-green-700" },
];

export default function HeroSection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate hero slides
  useEffect(() => {
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, []);

  // Animate content on mount and on slide change
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
    tl.fromTo(
      productsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
  }, [slideIndex]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-green-200/20 blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
        <div className="absolute left-1/3 top-1/3 h-60 w-60 rounded-full bg-amber-100/20 blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
      </div>

      {/* Floating leaves decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf className="absolute left-[10%] top-[20%] h-6 w-6 text-green-200/30 animate-bounce" style={{ animationDuration: "6s" }} />
        <Leaf className="absolute right-[15%] top-[15%] h-4 w-4 text-amber-200/30 animate-bounce" style={{ animationDuration: "7s", animationDelay: "1s" }} />
        <Leaf className="absolute left-[20%] bottom-[25%] h-5 w-5 text-green-200/30 animate-bounce" style={{ animationDuration: "8s", animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left" ref={contentRef}>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 animate-fade-in">
              <Sprout className="h-4 w-4" />
              <span>100% Certified Organic</span>
            </div>

            <h1
              ref={titleRef}
              className="mt-6 text-4xl font-bold tracking-tight text-green-900 sm:text-5xl lg:text-6xl"
            >
              {heroSlides[slideIndex].title}
              <span className="block text-amber-600">{heroSlides[slideIndex].subtitle}</span>
            </h1>

            <p
              ref={textRef}
              className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-green-700/80 lg:mx-0"
            >
              {heroSlides[slideIndex].desc}
            </p>

            {/* Slide indicators */}
            <div className="mt-4 flex items-center justify-center gap-2 lg:justify-start">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === slideIndex
                      ? "w-8 bg-amber-500 shadow-sm"
                      : "w-2 bg-green-200 hover:bg-green-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div ref={ctaRef} className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-700 hover:shadow-green-300 hover:scale-105 active:scale-95"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/categories"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-green-200 px-8 py-3 text-sm font-semibold text-green-700 transition-all hover:border-green-300 hover:bg-green-50 hover:scale-105 active:scale-95"
              >
                Explore Categories
              </Link>
            </div>

            <div ref={productsRef} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {products.map((product, i) => {
                const Icon = product.icon;
                return (
                  <span
                    key={product.name}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:scale-110 ${product.color}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {product.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right side - Image carousel */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-96 w-96">
              {/* Main image with crossfade */}
              {heroSlides.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 overflow-hidden rounded-full transition-all duration-700 ${
                    i === slideIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={`Organic Farm ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-4 rounded-full bg-white/50 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Sprout className="mx-auto h-16 w-16 text-green-700 animate-bounce" style={{ animationDuration: "3s" }} />
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
