"use client";

import { Sprout, Droplets, Wheat } from "lucide-react";

const benefits = [
  {
    title: "Benefits of Turmeric",
    icon: Sprout,
    color: "bg-amber-100 text-amber-700",
    items: [
      "Powerful anti-inflammatory properties",
      "Rich in antioxidants",
      "Boosts immune system",
      "Supports joint health",
      "Aids digestion",
    ],
  },
  {
    title: "Benefits of Honey",
    icon: Droplets,
    color: "bg-yellow-100 text-yellow-700",
    items: [
      "Natural energy booster",
      "Antibacterial properties",
      "Soothes sore throat",
      "Rich in antioxidants",
      "Promotes better sleep",
    ],
  },
  {
    title: "Benefits of Millets",
    icon: Wheat,
    color: "bg-orange-100 text-orange-700",
    items: [
      "Naturally gluten-free",
      "Low glycemic index",
      "High in fiber and protein",
      "Rich in iron and calcium",
      "Heart-healthy grains",
    ],
  },
];

export default function HealthBenefits() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-900 sm:text-4xl">Health Benefits</h2>
          <p className="mt-2 text-green-600">Nature&apos;s power packed in every product</p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-green-100 bg-white p-6 transition-all hover:shadow-lg hover:shadow-green-100/50"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${benefit.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-green-900">{benefit.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {benefit.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
