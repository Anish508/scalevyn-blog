"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, LayoutDashboard, PenLine, LogOut, ExternalLink } from "lucide-react";

interface AdminNavbarProps {
  userEmail: string;
}

export default function AdminNavbar({ userEmail }: AdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/create", label: "New Post", icon: PenLine },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2.5 mr-4">
          <span className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </span>
          <div className="leading-tight hidden sm:block">
            <span className="font-display font-bold text-slate-900 text-sm tracking-tight">
              Scalevyn
            </span>
            <span className="text-[0.68rem] text-slate-400 block -mt-0.5">Admin Panel</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs text-slate-500 hover:text-brand-700 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            View Blog <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-bold">
              {userEmail[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-slate-600 max-w-[140px] truncate">{userEmail}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
