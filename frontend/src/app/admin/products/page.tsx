"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ImageIcon } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";
import { productsApi, categoriesApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({
    name: "", slug: "", price: "", salePrice: "", stock: "",
    categoryId: "", description: "", benefits: "", images: [] as string[],
  });

  const fetchProducts = () => {
    setLoading(true);
    const params: any = { page, limit: 10 };
    if (search) params.search = search;
    productsApi.getAll(params).then((data) => {
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const fetchCategories = () => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, [page, search]);

  const resetForm = () => {
    setForm({ name: "", slug: "", price: "", salePrice: "", stock: "", categoryId: "", description: "", benefits: "", images: [] });
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsApi.delete(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      price: +form.price,
      salePrice: form.salePrice ? +form.salePrice : null,
      stock: +form.stock,
      categoryId: +form.categoryId,
      images: form.images,
    };
    try {
      if (editing) {
        await productsApi.update(editing.id, data);
        toast.success("Product updated");
      } else {
        await productsApi.create(data);
        toast.success("Product created");
      }
      resetForm();
      fetchProducts();
    } catch (e: any) { toast.error(e.message); }
  };

  const editProduct = (p: any) => {
    setForm({
      name: p.name,
      slug: p.slug,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : "",
      stock: String(p.stock),
      categoryId: String(p.categoryId),
      description: p.description || "",
      benefits: p.benefits || "",
      images: p.images?.map((img: any) => img.url) || [],
    });
    setEditing(p);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} products</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="mt-4 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none"
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editing ? "Edit Product" : "New Product"}</h3>

          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input placeholder="Slug" value={form.slug}
              onChange={(e) => setForm((f: any) => ({ ...f, slug: e.target.value }))}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input type="number" placeholder="Price" value={form.price}
              onChange={(e) => setForm((f: any) => ({ ...f, price: e.target.value }))}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input type="number" placeholder="Sale Price (optional)" value={form.salePrice}
              onChange={(e) => setForm((f: any) => ({ ...f, salePrice: e.target.value }))}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" />
            <input type="number" placeholder="Stock" value={form.stock}
              onChange={(e) => setForm((f: any) => ({ ...f, stock: e.target.value }))}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <select value={form.categoryId}
              onChange={(e) => setForm((f: any) => ({ ...f, categoryId: e.target.value }))}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <textarea placeholder="Description" value={form.description}
              onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))}
              className="col-span-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none resize-none" rows={3} />
            <textarea placeholder="Benefits (comma separated)" value={form.benefits}
              onChange={(e) => setForm((f: any) => ({ ...f, benefits: e.target.value }))}
              className="col-span-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none resize-none" rows={2} />
          </div>

          {/* Image Upload */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Product Images</span>
            </div>
            <ImageUpload
              images={form.images}
              onImagesChange={(urls) => setForm((f: any) => ({ ...f, images: urls }))}
              maxImages={5}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit"
              className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              {editing ? "Update" : "Create"}
            </button>
            <button type="button" onClick={resetForm}
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Image</th>
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Price</th>
                <th className="text-left p-4 font-medium text-gray-600">Stock</th>
                <th className="text-left p-4 font-medium text-gray-600">Rating</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-300">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{p.name}</td>
                  <td className="p-4 text-gray-600">
                    {p.salePrice ? formatPrice(p.salePrice) : formatPrice(p.price)}
                  </td>
                  <td className="p-4">
                    <span className={`${p.stock <= 5 ? "text-amber-600 font-medium" : "text-gray-600"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{p.rating}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => editProduct(p)}
                      className="p-1.5 text-gray-400 hover:text-green-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
