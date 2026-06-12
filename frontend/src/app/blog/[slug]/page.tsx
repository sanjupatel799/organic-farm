"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { blogsApi } from "@/lib/api";

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    if (!slug) return;
    setLoading(true);
    blogsApi.getBySlug(slug).then((data) => {
      setBlog(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-green-900">Blog not found</h1>
        <Link href="/blogs" className="mt-4 text-green-600 hover:text-green-700">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blogs" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Blogs
      </Link>

      {blog.image && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img src={blog.image} alt={blog.title} className="w-full h-64 sm:h-96 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-green-500">
        <span className="flex items-center gap-1"><User className="h-4 w-4" /> {blog.author}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold text-green-900 sm:text-4xl">{blog.title}</h1>

      {blog.excerpt && (
        <p className="mt-4 text-lg text-green-600 italic">{blog.excerpt}</p>
      )}

      <div className="mt-8 prose prose-green max-w-none">
        {blog.content?.split("\n\n").map((paragraph: string, i: number) => (
          <p key={i} className="mb-4 leading-relaxed text-green-700">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
