"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { blogsApi } from "@/lib/api";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogsApi.getAll({ published: "true", page, limit: 9 }).then((data) => {
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-900 sm:text-4xl">Our Blog</h1>
        <p className="mt-2 text-green-600">Tips, guides, and stories about organic living</p>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 p-6 h-48" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: any) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group rounded-2xl border border-green-100 bg-white transition-all hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50"
              >
                {blog.image && (
                  <div className="overflow-hidden rounded-t-2xl">
                    <img src={blog.image} alt={blog.title} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-green-500">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {blog.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-green-900 line-clamp-2 group-hover:text-green-600">{blog.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-green-600 line-clamp-3">{blog.excerpt || blog.content?.substring(0, 200)}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:text-green-700">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="rounded-xl border border-green-200 p-2 text-green-600 hover:bg-green-50 disabled:opacity-50">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${p === page ? "bg-green-600 text-white" : "border border-green-200 text-green-700 hover:bg-green-50"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="rounded-xl border border-green-200 p-2 text-green-600 hover:bg-green-50 disabled:opacity-50">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
