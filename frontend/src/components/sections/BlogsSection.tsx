"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { blogsApi } from "@/lib/api";
import { useScrollReveal } from "@/hooks/use-animation";

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useScrollReveal({ y: 30 });

  useEffect(() => {
    blogsApi.getAll({ published: "true", limit: 3 }).then((data) => {
      setBlogs(data.blogs || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-green-50/50 py-16" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-green-900 sm:text-4xl">From Our Blog</h2>
            <p className="mt-2 text-green-600">Tips, guides, and stories about organic living</p>
          </div>
          <Link
            href="/blogs"
            className="hidden items-center gap-1 text-sm font-semibold text-green-600 transition-colors hover:text-green-700 sm:flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-6">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-3 h-3 w-full rounded bg-gray-200" />
                <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blogs.map((blog: any, i: number) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group rounded-2xl border border-green-100 bg-white transition-all duration-300 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 hover:-translate-y-1"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
              >
                {blog.image && (
                  <div className="overflow-hidden rounded-t-2xl">
                    <img src={blog.image} alt={blog.title} className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-green-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-green-900 line-clamp-2 group-hover:text-green-600">
                    {blog.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-green-600 line-clamp-3">
                    {blog.excerpt || blog.content?.substring(0, 150)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:text-green-700">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            View All Blogs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
