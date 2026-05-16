"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Building, Users, Shield, Bell, Palette } from "lucide-react";

const settingsSections = [
  { title: "Organization", desc: "Manage departments, teams, and hierarchy", icon: Building, color: "from-blue-500 to-blue-600" },
  { title: "User Management", desc: "Manage users, roles, and permissions", icon: Users, color: "from-emerald-500 to-emerald-600" },
  { title: "Security", desc: "Authentication, SSO, and Entra ID configuration", icon: Shield, color: "from-red-500 to-red-600" },
  { title: "Notifications", desc: "Configure email and Teams notification rules", icon: Bell, color: "from-amber-500 to-amber-600" },
  { title: "Appearance", desc: "Branding, themes, and customization", icon: Palette, color: "from-violet-500 to-violet-600" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">System configuration and administration</p>
      </div>
      <div className="space-y-3">
        {settingsSections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="border-gray-200 shadow-sm card-hover cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
                {s.title === "Security" && (
                  <Badge variant="outline" className="ml-auto text-[10px] bg-blue-50 text-blue-700">Entra ID Ready</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-gray-900">Microsoft Teams Integration</h3>
          <p className="text-xs text-gray-500 mt-1">Configure Teams notifications and adaptive cards for goal updates</p>
          <div className="mt-3 rounded-xl bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-700">Teams integration is ready for configuration. Connect your Microsoft 365 tenant to enable notifications.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
