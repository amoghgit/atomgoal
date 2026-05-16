"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAppStore } from "@/store/app-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, LogOut, User, Command, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  user: { name: string; email: string; role: string; designation?: string; departmentName?: string };
  notificationCount?: number;
}

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Dashboard", goals: "Goals", create: "Create", "shared-goals": "Shared Goals",
  achievements: "Achievements", checkins: "Check-ins", team: "Team Review", analytics: "Analytics",
  notifications: "Notifications", escalations: "Escalations", reports: "Reports", audit: "Audit Trail",
  cycles: "Cycle Management", settings: "Settings",
};

export function Header({ user, notificationCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const { toggleCommandPalette, sidebarOpen } = useAppStore();
  const [showMenu, setShowMenu] = React.useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: breadcrumbLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    isLast: i === segments.length - 1,
  }));

  const roleColors: Record<string, string> = {
    EMPLOYEE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MANAGER: "bg-amber-50 text-amber-700 border-amber-200",
    ADMIN: "bg-violet-50 text-violet-700 border-violet-200",
  };

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md transition-all duration-300",
      sidebarOpen ? "ml-64" : "ml-[70px]"
    )}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
            <span className={cn("font-medium transition-colors", crumb.isLast ? "text-gray-900" : "text-gray-400")}>{crumb.label}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden gap-2 rounded-xl text-gray-500 hover:text-gray-700 md:flex" onClick={toggleCommandPalette}>
          <Search className="h-4 w-4" />
          <span className="text-xs text-gray-400">Search</span>
          <kbd className="pointer-events-none ml-1 flex h-5 items-center rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] text-gray-400">
            <Command className="mr-0.5 h-2.5 w-2.5" />K
          </kbd>
        </Button>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative rounded-xl text-gray-500 hover:text-gray-700">
            <Bell className="h-[18px] w-[18px]" />
            {notificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>
        </Link>

        <div className="mx-1 h-8 w-px bg-gray-200" />

        {/* User Menu - Simple popover instead of base-ui dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-50 cursor-pointer outline-none"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-[11px] text-gray-500">{user.designation || user.role}</p>
            </div>
            <Avatar className="h-8 w-8 border-2 border-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">{initials}</AvatarFallback>
            </Avatar>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
                  <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <Badge variant="outline" className={cn("mt-1.5 text-[10px]", roleColors[user.role])}>{user.role}</Badge>
                </div>
                <button
                  onClick={() => { setShowMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4" /> Profile Settings
                </button>
                <div className="my-1 h-px bg-gray-100" />
                <button
                  onClick={() => { setShowMenu(false); signOut({ callbackUrl: "/login" }); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
