"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import {
  LayoutDashboard, Target, Users, CheckSquare, BarChart3, Settings, Shield,
  Bell, AlertTriangle, FileText, Calendar, Share2, ChevronLeft, ChevronRight,
  Atom, TrendingUp, ClipboardList,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Goals", href: "/goals", icon: Target, roles: ["EMPLOYEE", "MANAGER"] },
  { label: "Goal Creation", href: "/goals/create", icon: ClipboardList, roles: ["EMPLOYEE", "MANAGER"] },
  { label: "Shared Goals", href: "/shared-goals", icon: Share2 },
  { label: "Achievements", href: "/achievements", icon: TrendingUp, roles: ["EMPLOYEE", "MANAGER"] },
  { label: "Check-ins", href: "/checkins", icon: CheckSquare },
  { label: "Team Review", href: "/team", icon: Users, roles: ["MANAGER", "ADMIN"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Escalations", href: "/escalations", icon: AlertTriangle, roles: ["MANAGER", "ADMIN"] },
  { label: "Reports", href: "/reports", icon: FileText, roles: ["MANAGER", "ADMIN"] },
  { label: "Audit Trail", href: "/audit", icon: Shield, roles: ["ADMIN"] },
  { label: "Cycle Mgmt", href: "/cycles", icon: Calendar, roles: ["ADMIN"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "w-64" : "w-[70px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-100 px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200">
            <Atom className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-gray-900">AtomGoal</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Goal Tracker</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href} title={!sidebarOpen ? item.label : undefined}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] flex-shrink-0 transition-colors", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-gray-100 p-3">
        <button onClick={toggleSidebar} className="flex w-full items-center justify-center rounded-xl py-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
