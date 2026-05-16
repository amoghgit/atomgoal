"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, Shield, Users } from "lucide-react";

const demoAccounts = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@atomgoal.com",
    role: "EMPLOYEE",
    designation: "Software Engineer",
    department: "Engineering",
    icon: User,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@atomgoal.com",
    role: "MANAGER",
    designation: "Engineering Manager",
    department: "Engineering",
    icon: Users,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-200 hover:border-amber-400",
  },
  {
    name: "Anita Desai",
    email: "anita.desai@atomgoal.com",
    role: "ADMIN",
    designation: "HR Director",
    department: "Human Resources",
    icon: Shield,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 border-violet-200 hover:border-violet-400",
  },
];

interface DemoSwitcherProps {
  variant?: "floating" | "inline";
}

export function DemoSwitcher({ variant = "floating" }: DemoSwitcherProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogin = async (email: string) => {
    setLoading(email);
    try {
      await signIn("credentials", {
        email,
        callbackUrl: "/dashboard",
      });
    } catch {
      setLoading(null);
    }
  };

  if (variant === "inline") {
    return (
      <div className="space-y-3">
        {demoAccounts.map((account) => {
          const Icon = account.icon;
          return (
            <button
              key={account.email}
              onClick={() => handleLogin(account.email)}
              disabled={loading !== null}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                account.bgColor,
                loading === account.email && "opacity-70"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                  account.color
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {account.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold uppercase"
                  >
                    {account.role}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{account.designation}</p>
                <p className="text-xs text-gray-400">{account.department}</p>
              </div>
              {loading === account.email && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="mb-3 w-72 animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Switch Role
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.email}
                  onClick={() => handleLogin(account.email)}
                  disabled={loading !== null}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
                    account.bgColor,
                    loading === account.email && "opacity-70"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br",
                      account.color
                    )}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {account.name}
                    </p>
                    <p className="text-[11px] text-gray-500">{account.role}</p>
                  </div>
                  {loading === account.email && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-300 transition-transform hover:scale-110"
      >
        <Users className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
