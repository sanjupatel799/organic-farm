"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { couponsApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ code: "", discount: "", discountType: "PERCENTAGE", expiry: "", minAmount: "", maxUses: "" });

  const fetchCoupons = () => {
    setLoading(true);
    couponsApi.getAll().then((data) => { setCoupons(data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    try { await couponsApi.delete(id); toast.success("Coupon deleted"); fetchCoupons(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, discount: +form.discount, minAmount: form.minAmount ? +form.minAmount : null, maxUses: form.maxUses ? +form.maxUses : null };
    try {
      if (editing) { await couponsApi.update(editing.id, data); toast.success("Coupon updated"); }
      else { await couponsApi.create(data); toast.success("Coupon created"); }
      setShowForm(false); setEditing(null); setForm({ code: "", discount: "", discountType: "PERCENTAGE", expiry: "", minAmount: "", maxUses: "" });
      fetchCoupons();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Coupons</h1><p className="text-sm text-gray-500">{coupons.length} coupons</p></div>
        <button onClick={() => { setEditing(null); setForm({ code: "", discount: "", discountType: "PERCENTAGE", expiry: "", minAmount: "", maxUses: "" }); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editing ? "Edit Coupon" : "New Coupon"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Code" value={form.code} onChange={(e) => setForm((f: any) => ({ ...f, code: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input type="number" placeholder="Discount" value={form.discount} onChange={(e) => setForm((f: any) => ({ ...f, discount: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <select value={form.discountType} onChange={(e) => setForm((f: any) => ({ ...f, discountType: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none">
              <option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed</option>
            </select>
            <input type="date" value={form.expiry} onChange={(e) => setForm((f: any) => ({ ...f, expiry: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input type="number" placeholder="Min Amount" value={form.minAmount} onChange={(e) => setForm((f: any) => ({ ...f, minAmount: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" />
            <input type="number" placeholder="Max Uses" value={form.maxUses} onChange={(e) => setForm((f: any) => ({ ...f, maxUses: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="text-left p-4 font-medium text-gray-600">Code</th><th className="text-left p-4 font-medium text-gray-600">Discount</th><th className="text-left p-4 font-medium text-gray-600">Uses</th><th className="text-left p-4 font-medium text-gray-600">Status</th><th className="text-right p-4 font-medium text-gray-600">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{c.code}</td>
                  <td className="p-4 text-gray-600">{c.discount}{c.discountType === "PERCENTAGE" ? "%" : "$"}</td>
                  <td className="p-4 text-gray-600">{c.usedCount}/{c.maxUses || "∞"}</td>
                  <td className="p-4"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setForm({ code: c.code, discount: String(c.discount), discountType: c.discountType, expiry: c.expiry?.split("T")[0] || "", minAmount: c.minAmount ? String(c.minAmount) : "", maxUses: c.maxUses ? String(c.maxUses) : "" }); setEditing(c); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-green-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
