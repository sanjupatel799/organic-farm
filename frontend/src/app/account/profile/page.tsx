"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  if (!isAuthenticated) { router.push("/login"); return null; }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateProfile(form);
      setUser(updated);
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword(passwords.oldPassword, passwords.newPassword);
      toast.success("Password changed!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="text-2xl font-bold text-green-900">My Profile</h1>

      <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-green-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-green-900">{user?.name}</p>
            <p className="text-sm text-green-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">
              <User className="inline h-4 w-4 mr-1" /> Name
            </label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">
              <Mail className="inline h-4 w-4 mr-1" /> Email
            </label>
            <input type="email" value={user?.email || ""} disabled
              className="w-full rounded-xl border border-green-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">
              <Phone className="inline h-4 w-4 mr-1" /> Phone
            </label>
            <input type="tel" value={form.phone || ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="mt-8 pt-6 border-t border-green-100 space-y-4">
          <h3 className="font-bold text-green-900">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">Current Password</label>
            <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords((p) => ({ ...p, oldPassword: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">New Password</label>
            <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">Confirm New Password</label>
            <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
              className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none ring-green-300 focus:ring-2" />
          </div>
          <button type="submit" disabled={changingPassword}
            className="rounded-xl border border-green-200 px-6 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50">
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
