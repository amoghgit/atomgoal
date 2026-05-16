"use client";

import React from "react";
import { Atom } from "lucide-react";
import { DemoSwitcher } from "@/components/demo-switcher";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-200">
            <Atom className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            AtomGoal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Goal Setting & Tracking Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a demo account to get started
            </p>
          </div>

          <DemoSwitcher variant="inline" />

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">👨‍⚖️ Note to Judges</h3>
            <p className="text-xs text-blue-600/90 leading-relaxed">
              <strong>Check-in Schedule Demo Mode:</strong> In production, Phase 2 Check-in windows (Q1, Q2, etc.) are strictly enforced based on the Admin&apos;s Cycle Configuration dates. However, for the purpose of this hackathon evaluation, we have temporarily bypassed the date-locks so you can test and grade the Check-in features regardless of the current real-world date.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          AtomGoal © 2024 • Enterprise Goal Management
        </p>
      </div>
    </div>
  );
}
