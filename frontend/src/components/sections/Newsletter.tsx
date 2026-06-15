"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/use-animation";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const sectionRef = useScrollReveal({ y: 30 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="bg-gradient-to-r from-green-700 to-green-600 py-16" ref={sectionRef}>
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        {subscribed ? (
          <div className="animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">You&apos;re Subscribed!</h2>
            <p className="mt-2 text-green-200">
              Thank you for joining our community. We&apos;ll send you the latest updates and exclusive offers.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Stay Connected With Us
            </h2>
            <p className="mt-2 text-green-200">
              Subscribe to get exclusive offers, health tips, and new product updates.
            </p>
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-full border border-green-500 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-green-300 outline-none ring-white/30 backdrop-blur-sm focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
              >
                Subscribe <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
