"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { contactApi } from "@/lib/api";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await contactApi.send(form);
      setSent(true);
      toast.success("Message sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-900 sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-green-600">We&apos;d love to hear from you</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "hello@organicfarm.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
            { icon: MapPin, label: "Address", value: "123 Organic Lane, Farmville, Nature County" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">{item.label}</h3>
                  <p className="text-sm text-green-600">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-green-900">Message Sent!</h3>
              <p className="mt-2 text-green-600">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name" className="w-full rounded-xl border border-green-200 bg-white py-3 px-4 text-sm outline-none ring-green-300 focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="w-full rounded-xl border border-green-200 bg-white py-3 px-4 text-sm outline-none ring-green-300 focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">Message</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="How can we help you?" className="w-full rounded-xl border border-green-200 bg-white py-3 px-4 text-sm outline-none ring-green-300 focus:ring-2 resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                {loading ? "Sending..." : "Send Message"} <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
