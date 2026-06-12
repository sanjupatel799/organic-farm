import { Leaf, Shield, Sun, Truck } from "lucide-react";

const badges = [
  { icon: Leaf, label: "100% Organic", desc: "Certified organic products" },
  { icon: Shield, label: "Chemical Free", desc: "No pesticides or chemicals" },
  { icon: Sun, label: "Farm Fresh", desc: "Directly from local farms" },
  { icon: Truck, label: "Fast Delivery", desc: "Free shipping over $50" },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex flex-col items-center rounded-2xl border border-green-100 bg-green-50/50 p-6 text-center transition-all hover:border-green-200 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-green-900">{badge.label}</h3>
                <p className="mt-1 text-xs text-green-500">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
