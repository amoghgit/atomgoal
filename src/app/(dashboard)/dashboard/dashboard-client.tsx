"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2, Clock, TrendingUp, Bell, ArrowRight, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SUBMITTED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  LOCKED: "bg-violet-50 text-violet-700",
};

interface DashboardClientProps {
  stats: { totalGoals: number; approvedGoals: number; pendingGoals: number; completedAchievements: number };
  recentGoals: any[];
  notifications: any[];
  departments: any[];
  role: string;
  userName: string;
}

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export function DashboardClient({ stats, recentGoals, notifications, departments, role, userName }: DashboardClientProps) {
  const statCards = [
    { label: "Total Goals", value: stats.totalGoals, icon: Target, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { label: "Approved", value: stats.approvedGoals, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
    { label: role === "MANAGER" ? "Pending Review" : "Submitted", value: stats.pendingGoals, icon: Clock, color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
    { label: "Completed", value: stats.completedAchievements, icon: TrendingUp, color: "from-violet-500 to-violet-600", bg: "bg-violet-50" },
  ];

  const chartData = [
    { name: "Draft", value: Math.max(stats.totalGoals - stats.approvedGoals - stats.pendingGoals, 0) },
    { name: "Approved", value: stats.approvedGoals },
    { name: "Pending", value: stats.pendingGoals },
    { name: "Completed", value: stats.completedAchievements },
  ];

  const deptData = departments.map((d: any) => ({ name: d.name, employees: d._count?.users || 0 }));

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}, {userName.split(" ")[0]} 👋</h1>
            <p className="text-sm text-gray-500 mt-1">
              {role === "ADMIN" ? "Organization overview" : role === "MANAGER" ? "Team performance overview" : "Your goal progress overview"}
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">
            {role} Dashboard
          </Badge>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <Card className="card-hover border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-md", stat.color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <BarChart3 className="h-4 w-4 text-blue-600" /> Goal Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64" style={{ minHeight: 256, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4} strokeWidth={2} stroke="#fff">
                      {chartData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                {chartData.filter(d => d.value > 0).map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Users className="h-4 w-4 text-blue-600" /> Department Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64" style={{ minHeight: 256, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="employees" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Goals & Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Goals</CardTitle>
              <Link href="/goals" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGoals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No goals yet</p>
                  <Link href="/goals/create" className="mt-2 text-xs font-medium text-blue-600 hover:underline">Create your first goal →</Link>
                </div>
              ) : recentGoals.map((goal: any) => (
                <div key={goal.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{goal.title}</p>
                      {goal.isShared && <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">Shared</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{goal.thrustArea} • Weight: {goal.weightage}%</p>
                  </div>
                  <Badge className={cn("ml-3 text-[10px] font-semibold", statusColors[goal.status])}>{goal.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Bell className="h-4 w-4 text-blue-600" /> Notifications
              </CardTitle>
              <Link href="/notifications" className="text-xs font-medium text-blue-600 hover:text-blue-700">View all</Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Bell className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500">No notifications</p>
                </div>
              ) : notifications.map((n: any) => (
                <div key={n.id} className={cn("rounded-lg border p-3 transition-colors", n.isRead ? "border-gray-100 bg-white" : "border-blue-100 bg-blue-50/50")}>
                  <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{format(new Date(n.createdAt), "MMM d, h:mm a")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
