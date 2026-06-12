"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { addressesApi } from "@/lib/api";
import { toast } from "sonner";

export default function NewAddressPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) { router.push("/login"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill in all fields"); return;
    }
    setSaving(true);
    try {
      await addressesApi.create(form);
      toast.success("Address added!");
      router.push("/account/address");
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/account/address" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold text-green-900">Add New Address</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-green-800 mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Pincode</label>
            <input type="text" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-green-800 mb-1">Address</label>
            <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">City</label>
            <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">State</label>
            <input type="text" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
              className="accent-green-600" id="isDefault" />
            <label htmlFor="isDefault" className="text-sm text-green-700">Set as default address</label>
          </div>
        </div>
        <button type="submit" disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
}
