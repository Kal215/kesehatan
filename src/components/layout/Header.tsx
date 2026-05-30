"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut } from "lucide-react";

interface HeaderProps {
  userRole?: string;
  userName?: string;
}

export function Header({ userRole, userName }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  const navLinks =
    userRole === "ADMIN"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/patients", label: "Data Pasien" },
          { href: "/admin/midwives", label: "Data Bidan" },
          { href: "/admin/visits", label: "Kunjungan" },
          { href: "/admin/reports", label: "Laporan" },
        ]
      : userRole === "BIDAN"
        ? [
            { href: "/midwife", label: "Dashboard" },
            { href: "/midwife/patients", label: "Data Pasien" },
            { href: "/midwife/visits", label: "Kunjungan" },
            { href: "/midwife/examinations", label: "Pemeriksaan" },
          ]
        : userRole === "PASIEN"
          ? [
              { href: "/patient", label: "Dashboard" },
              { href: "/patient/visits", label: "Kunjungan" },
              { href: "/patient/history", label: "Riwayat" },
            ]
          : [];

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="text-lg font-bold text-gray-800">Klinik Bersalin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {userName && (
              <div className="text-sm">
                <p className="text-gray-600">Halo, {userName}</p>
              </div>
            )}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mt-4"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
