"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { addressesApi } from "@/lib/api";
import { toast } from "sonner";

export default function AddressPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    addressesApi.getAll().then((data: any) => {
      setAddresses(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated, router]);

  const handleDelete = async (id: number) => {
    try {
      await addressesApi.delete(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressesApi.update(id, { isDefault: true });
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      toast.success("Default address updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-100" />)}</div></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">My Addresses</h1>
        <Link href="/account/address/new" className="flex items-center gap-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <Plus className="h-4 w-4" /> Add New
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="h-16 w-16 text-green-300" />
          <p className="mt-4 text-lg font-semibold text-green-800">No addresses saved</p>
          <Link href="/account/address/new" className="mt-4 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">Add Address</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {addresses.map((addr: any) => (
            <div key={addr.id} className="rounded-2xl border border-green-100 bg-white p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-green-900">{addr.name}</p>
                    {addr.isDefault && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Default</span>}
                  </div>
                  <p className="mt-1 text-sm text-green-500">{addr.phone}</p>
                  <p className="mt-1 text-sm text-green-700">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleSetDefault(addr.id)} disabled={addr.isDefault}
                    className="text-xs text-green-600 hover:text-green-700 disabled:text-gray-300 disabled:cursor-not-allowed">
                    Set Default
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
