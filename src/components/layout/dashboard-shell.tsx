"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/layout/command-palette";
import { DemoSwitcher } from "@/components/demo-switcher";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
    designation?: string;
    departmentName?: string;
  };
  notificationCount: number;
}

export function DashboardShell({
  children,
  user,
  notificationCount,
}: DashboardShellProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar userRole={user.role} />
      <Header user={user} notificationCount={notificationCount} />

      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] p-6 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-[70px]"
        )}
      >
        <div className="page-transition">{children}</div>
      </main>

      <CommandPalette />
      <DemoSwitcher variant="floating" />
    </div>
  );
}
