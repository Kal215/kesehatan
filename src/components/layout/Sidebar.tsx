"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileBarChart,
  Stethoscope,
  ClipboardList,
  History,
  Heart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/patients", label: "Data Pasien", icon: Users },
  { href: "/admin/midwives", label: "Data Bidan", icon: UserCheck },
  { href: "/admin/visits", label: "Kunjungan", icon: Calendar },
  { href: "/admin/reports", label: "Laporan", icon: FileBarChart },
];

const midwifeLinks = [
  { href: "/midwife", label: "Dashboard", icon: LayoutDashboard },
  { href: "/midwife/patients", label: "Data Pasien", icon: Users },
  { href: "/midwife/visits", label: "Kunjungan", icon: Calendar },
  { href: "/midwife/examinations", label: "Pemeriksaan", icon: Stethoscope },
];

const patientLinks = [
  { href: "/patient", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/visits", label: "Kunjungan Saya", icon: ClipboardList },
  { href: "/patient/history", label: "Riwayat Medis", icon: History },
];

export function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links =
    userRole === "ADMIN"
      ? adminLinks
      : userRole === "BIDAN"
        ? midwifeLinks
        : patientLinks;

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/midwife" || href === "/patient") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const roleLabel =
    userRole === "ADMIN" ? "Administrator" : userRole === "BIDAN" ? "Bidan" : "Pasien";

  const roleColor =
    userRole === "ADMIN"
      ? "from-violet-500 to-blue-500"
      : userRole === "BIDAN"
        ? "from-pink-500 to-rose-500"
        : "from-sky-500 to-cyan-500";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Logo & Brand ── */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`w-10 h-10 bg-gradient-to-br ${roleColor} rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform group-hover:scale-105`}>
            <Heart size={20} className="fill-white/30" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <span className="text-lg font-black text-gray-800 tracking-tight">Klinik Bersalin</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold -mt-0.5">
                Sistem Informasi
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Role Badge ── */}
      {!collapsed && (
        <div className="mx-4 mb-5">
          <div className={`bg-gradient-to-r ${roleColor} rounded-xl px-4 py-2.5 text-white shadow-md animate-fade-in-up`}>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">Portal</div>
            <div className="text-sm font-bold">{roleLabel}</div>
          </div>
        </div>
      )}

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {links.map((link, idx) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 animate-fade-in-up ${
                active
                  ? `bg-gradient-to-r ${roleColor} text-white shadow-md`
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  active ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── User Info & Logout ── */}
      <div className="p-4 border-t border-gray-100">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-3 animate-fade-in">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {userName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-800 truncate">{userName || "User"}</div>
              <div className="text-xs text-gray-400 truncate">{userEmail || ""}</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {userName?.charAt(0) || "U"}
            </div>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all active:scale-95 ${collapsed ? "px-2" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && "Keluar"}
        </button>
      </div>

      {/* ── Collapse Toggle (Desktop) ── */}
      <div className="hidden lg:block p-3 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && "Perkecil Sidebar"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Menu Button (visible only on small screens) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full z-50 bg-white shadow-2xl transition-transform duration-300 w-[280px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-30 sidebar-transition ${
          collapsed ? "w-[80px]" : "w-[280px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
