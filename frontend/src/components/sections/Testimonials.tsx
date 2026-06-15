"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import gsap from "gsap";
import { useScrollReveal } from "@/hooks/use-animation";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "California",
    text: "I've been ordering from Organic Farm for months now. The quality of their honey is unmatched! My whole family loves it.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    location: "New York",
    text: "The millets are incredibly fresh and the delivery is always on time. Highly recommended for anyone looking for genuine organic products.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    location: "Texas",
    text: "Finally found a place that delivers truly organic spices. The turmeric powder is amazing - you can taste the difference!",
    rating: 5,
  },
  {
    name: "David Kim",
    location: "Washington",
    text: "Great selection of organic oils. The cold-pressed coconut oil is my favorite. Customer service is excellent too!",
    rating: 4,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal({ y: 30 });

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };
  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // GSAP animation on slide change
  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }, contentRef.current);
    return () => ctx.revert();
  }, [current]);

  const testimonial = testimonials[current];

  return (
    <section className="relative overflow-hidden py-16" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-green-100/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-green-900 sm:text-4xl">What Our Customers Say</h2>
        <p className="mt-2 text-green-600">Real reviews from real customers</p>

        <div className="mt-10 relative">
          <div className="relative" ref={contentRef}>
            <Quote className="mx-auto h-10 w-10 text-amber-300" />

            <p className="mt-4 text-lg leading-relaxed text-green-800 italic">
              &ldquo;{testimonial.text}&rdquo;
            </p>

            <div className="mt-4 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 transition-all duration-300 ${
                    i < testimonial.rating
                      ? "fill-amber-400 text-amber-400 scale-110"
                      : "fill-gray-200 text-gray-200"
                  }`}
                  style={{
                    animation: i < testimonial.rating ? `starPop 0.3s ease-out ${i * 0.1}s both` : "none",
                  }}
                />
              ))}
            </div>

            <p className="mt-4 font-semibold text-green-900">{testimonial.name}</p>
            <p className="text-sm text-green-500">{testimonial.location}</p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="rounded-full border border-green-200 p-2 text-green-600 transition-all hover:bg-green-50 hover:scale-110 active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === current ? "w-8 bg-amber-500 shadow-sm" : "w-2 bg-green-200 hover:bg-green-300"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full border border-green-200 p-2 text-green-600 transition-all hover:bg-green-50 hover:scale-110 active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes starPop {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
