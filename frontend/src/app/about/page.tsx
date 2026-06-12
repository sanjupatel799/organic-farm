import Link from "next/link";
import { Leaf, Sprout, Heart, TreePine, ArrowRight } from "lucide-react";

const values = [
  { icon: Sprout, title: "Sustainable Farming", desc: "We practice regenerative agriculture that nourishes the soil and protects biodiversity." },
  { icon: Heart, title: "Health First", desc: "Our products are 100% organic, chemical-free, and packed with natural goodness." },
  { icon: TreePine, title: "Eco-Friendly", desc: "From farm to table, we minimize our carbon footprint with sustainable packaging." },
  { icon: Leaf, title: "Community Support", desc: "We work directly with local farmers, ensuring fair prices and supporting rural communities." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 to-green-50 p-8 sm:p-12">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-green-900 sm:text-5xl">Our Story</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-green-700 leading-relaxed">
            Organic Farm was born from a simple belief: everyone deserves access to pure, natural, and
            nutritious food. We connect you directly with organic farmers who share our passion for quality.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <img
            src="/images/general/about-farm.svg"
            alt="Our Organic Farm"
            className="h-48 w-48 rounded-full object-cover shadow-lg sm:h-56 sm:w-56"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="mt-16 rounded-2xl bg-gradient-to-br from-green-50 to-amber-50 p-8 sm:p-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-green-900">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-green-700">
            To make organic living accessible to everyone by providing high-quality, affordable organic
            products while supporting sustainable farming practices and local communities.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-green-900 text-center">What We Stand For</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="rounded-2xl border border-green-100 bg-white p-6 transition-all hover:shadow-md">
                <Icon className="h-8 w-8 text-green-600" />
                <h3 className="mt-3 text-lg font-bold text-green-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-green-600">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-green-900">Ready to Start Your Organic Journey?</h2>
        <p className="mt-2 text-green-600">Explore our range of fresh organic products</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          Shop Now <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
