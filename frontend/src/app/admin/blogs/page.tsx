"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { blogsApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ title: "", slug: "", content: "", excerpt: "", author: "", published: false });

  const fetchBlogs = () => {
    setLoading(true);
    blogsApi.getAll({ page, limit: 10 }).then((data) => {
      setBlogs(data.blogs || []);
      setTotal(data.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog?")) return;
    try { await blogsApi.delete(id); toast.success("Blog deleted"); fetchBlogs(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await blogsApi.update(editing.id, form); toast.success("Blog updated"); }
      else { await blogsApi.create(form); toast.success("Blog created"); }
      setShowForm(false); setEditing(null); setForm({ title: "", slug: "", content: "", excerpt: "", author: "", published: false });
      fetchBlogs();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Blogs</h1><p className="text-sm text-gray-500">{total} posts</p></div>
        <button onClick={() => { setEditing(null); setForm({ title: "", slug: "", content: "", excerpt: "", author: "", published: false }); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <Plus className="h-4 w-4" /> New Blog
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editing ? "Edit Blog" : "New Blog"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))} className="col-span-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm((f: any) => ({ ...f, slug: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input placeholder="Author" value={form.author} onChange={(e) => setForm((f: any) => ({ ...f, author: e.target.value }))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" required />
            <input placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((f: any) => ({ ...f, excerpt: e.target.value }))} className="col-span-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" />
            <textarea placeholder="Content" value={form.content} onChange={(e) => setForm((f: any) => ({ ...f, content: e.target.value }))} className="col-span-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none resize-none" rows={6} required />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f: any) => ({ ...f, published: e.target.checked }))} className="accent-green-600" />
              <span className="text-sm text-gray-700">Published</span>
            </label>
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
              <tr><th className="text-left p-4 font-medium text-gray-600">Title</th><th className="text-left p-4 font-medium text-gray-600">Author</th><th className="text-left p-4 font-medium text-gray-600">Status</th><th className="text-left p-4 font-medium text-gray-600">Date</th><th className="text-right p-4 font-medium text-gray-600">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{b.title}</td>
                  <td className="p-4 text-gray-600">{b.author}</td>
                  <td className="p-4"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{b.published ? "Published" : "Draft"}</span></td>
                  <td className="p-4 text-gray-600">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setForm({ title: b.title, slug: b.slug, content: b.content, excerpt: b.excerpt || "", author: b.author, published: b.published }); setEditing(b); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-green-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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
