"use client";

import { Leaf, Shield, Sun, Truck } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animation";

const badges = [
  { icon: Leaf, label: "100% Organic", desc: "Certified organic products" },
  { icon: Shield, label: "Chemical Free", desc: "No pesticides or chemicals" },
  { icon: Sun, label: "Farm Fresh", desc: "Directly from local farms" },
  { icon: Truck, label: "Fast Delivery", desc: "Free shipping over $50" },
];

export default function TrustBadges() {
  const sectionRef = useScrollReveal({ y: 20 });

  return (
    <section className="bg-white py-10" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex flex-col items-center rounded-2xl border border-green-100 bg-green-50/50 p-6 text-center transition-all duration-300 hover:border-green-200 hover:shadow-md hover:-translate-y-1"
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 transition-all group-hover:scale-110">
                  <Icon className="h-7 w-7 text-green-600 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-green-900">{badge.label}</h3>
                <p className="mt-1 text-xs text-green-500">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
