"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, Check, X } from "lucide-react";
import { contactApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    contactApi.getAll({ page: 1, limit: 50 }).then((data) => {
      setMessages(data.messages || []);
      setTotal(data.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: number) => {
    try {
      await contactApi.markAsRead(id);
      setMessages((prev) => prev.map((m: any) => m.id === id ? { ...m, read: true } : m));
      toast.success("Marked as read");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try { await contactApi.delete(id); setMessages((prev) => prev.filter((m: any) => m.id !== id)); toast.success("Message deleted"); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
      <p className="mt-1 text-sm text-gray-500">{total} messages</p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}</div>
        ) : messages.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className={`rounded-2xl border bg-white p-6 transition-all ${msg.read ? "border-gray-100" : "border-green-200 bg-green-50/30"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${msg.read ? "bg-gray-100" : "bg-green-100"}`}>
                    <Mail className={`h-5 w-5 ${msg.read ? "text-gray-400" : "text-green-600"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{msg.name}</p>
                      {!msg.read && <span className="h-2 w-2 rounded-full bg-green-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">{msg.message}</p>
                    <p className="mt-2 text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!msg.read && (
                    <button onClick={() => markAsRead(msg.id)} className="p-1.5 text-gray-400 hover:text-green-600" title="Mark as read">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-gray-400 hover:text-red-600" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
