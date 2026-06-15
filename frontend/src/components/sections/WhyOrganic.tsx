"use client";

import Link from "next/link";
import { ArrowRight, Sprout, Shield, Heart, TreesIcon as Tree } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animation";

const benefits = [
  {
    icon: Sprout,
    title: "Nutrient-Rich Soil",
    desc: "Our organic farming practices enrich the soil with natural compost and crop rotation, producing more nutritious food.",
  },
  {
    icon: Shield,
    title: "No Harmful Chemicals",
    desc: "Free from synthetic pesticides, herbicides, and GMOs. What you eat is pure and natural.",
  },
  {
    icon: Heart,
    title: "Better for Your Health",
    desc: "Studies show organic produce has higher antioxidants and beneficial nutrients for overall wellness.",
  },
  {
    icon: Tree,
    title: "Eco-Friendly Farming",
    desc: "Supporting sustainable agriculture that protects biodiversity and reduces environmental impact.",
  },
];

export default function WhyOrganic() {
  const sectionRef = useScrollReveal({ y: 30 });

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-16" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-900 sm:text-4xl">Why Organic?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-green-600">
            Choosing organic is more than a dietary preference — it&apos;s a commitment to your health
            and the planet.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-green-100 bg-white p-6 transition-all duration-300 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 hover:-translate-y-1"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-all group-hover:bg-green-200 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-green-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-green-600">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:scale-105 active:scale-95"
          >
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
