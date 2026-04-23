import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar userEmail={user.email ?? ""} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
