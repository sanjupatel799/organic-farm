"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoriesApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const fetchCategories = () => {
    setLoading(true);
    categoriesApi.getAll().then((data) => { setCategories(data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try { await categoriesApi.delete(id); toast.success("Category deleted"); fetchCategories(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await categoriesApi.update(editing.id, form); toast.success("Category updated"); }
      else { await categoriesApi.create(form); toast.success("Category created"); }
      setShowForm(false); setEditing(null); setForm({ name: "", slug: "", description: "" });
      fetchCategories();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Categories</h1><p className="text-sm text-gray-500">{categories.length} categories</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: "", slug: "", description: "" }); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editing ? "Edit Category" : "New Category"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm((f: any) => ({ ...f, slug: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} className="col-span-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="text-left p-4 font-medium text-gray-600">Name</th><th className="text-left p-4 font-medium text-gray-600">Slug</th><th className="text-right p-4 font-medium text-gray-600">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4 text-gray-500">{c.slug}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setForm({ name: c.name, slug: c.slug, description: c.description || "" }); setEditing(c); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-green-600"><Pencil className="h-4 w-4" /></button>
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
