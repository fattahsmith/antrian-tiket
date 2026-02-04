"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  onClick?: () => void;
}

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export default function DashboardSidebar({
  activeView,
  onViewChange,
  onLogout,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onViewChange("dashboard"),
    },
    {
      id: "queues",
      label: "Antrian",
      icon: Users,
      onClick: () => onViewChange("queues"),
    },
    {
      id: "services",
      label: "Layanan",
      icon: Stethoscope,
      onClick: () => onViewChange("services"),
    },
    {
      id: "doctors",
      label: "Dokter",
      icon: UserCheck,
      onClick: () => onViewChange("doctors"),
    },
    {
      id: "patients",
      label: "Pasien",
      icon: Activity,
      onClick: () => onViewChange("patients"),
    },
    {
      id: "reports",
      label: "Laporan",
      icon: FileText,
      onClick: () => onViewChange("reports"),
    },
    {
      id: "settings",
      label: "Pengaturan",
      icon: Settings,
      onClick: () => onViewChange("settings"),
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo & Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden rounded-lg p-2 transition-colors hover:bg-white/10 lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5 text-white/80" />
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Image src="/logo.png" width={32} height={32} alt="Logo" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                RS Kita
              </p>
              <h1 className="text-lg font-bold text-white">Dashboard</h1>
            </div>
          </div>
        )}
        {isCollapsed && (
          <Image src="/logo.png" width={40} height={40} alt="Logo" className="mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                item.onClick?.();
                setIsMobileOpen(false);
              }}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white shadow-[0_10px_35px_rgba(59,130,246,0.25)]"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
              )}
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                }`}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer - User & Logout */}
      <div className="mt-6 border-t border-white/10 pt-4">
        {!isCollapsed && (
          <div className="mb-3 rounded-lg bg-white/10 p-3 text-white">
            <p className="text-xs font-medium text-white/70">Petugas</p>
            <p className="text-sm font-semibold">Staff Rumah Sakit</p>
          </div>
        )}
        <button
          onClick={() => {
            onLogout();
            setIsMobileOpen(false);
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-100 transition-colors hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white/90 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 p-6 shadow-2xl ring-1 ring-white/10 lg:hidden"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:border-r lg:border-white/10 lg:bg-gradient-to-b lg:from-slate-900 lg:via-slate-900 lg:to-slate-800 lg:p-6 lg:text-white ${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        } transition-all duration-300`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

