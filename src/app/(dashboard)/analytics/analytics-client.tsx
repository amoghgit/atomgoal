"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart as PieIcon, TrendingUp, Activity, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

interface AnalyticsClientProps {
  goalsByStatus: any[]; goalsByThrust: any[]; achievementStats: any[]; departmentStats: any[]; checkinCompletion?: any[];
}

export function AnalyticsClient({ goalsByStatus, goalsByThrust, achievementStats, departmentStats, checkinCompletion = [] }: AnalyticsClientProps) {
  const statusData = goalsByStatus.map((g: any) => ({ name: g.status.replace("_", " "), value: g._count }));
  const thrustData = goalsByThrust.map((g: any) => ({ name: g.thrustArea, count: g._count }));

  const quarterData = ["Q1", "Q2", "Q3", "Q4"].map((q) => {
    const qStats = achievementStats.filter((a: any) => a.quarter === q);
    return {
      quarter: q,
      completed: qStats.find((s: any) => s.status === "COMPLETED")?._count || 0,
      onTrack: qStats.find((s: any) => s.status === "ON_TRACK")?._count || 0,
      notStarted: qStats.find((s: any) => s.status === "NOT_STARTED")?._count || 0,
    };
  });

  const deptGoalData = departmentStats.map((d: any) => ({
    name: d.name,
    goals: d.users.reduce((s: number, u: any) => s + (u._count?.goals || 0), 0),
    employees: d.users.length,
  }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Organization-wide performance insights</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><PieIcon className="h-4 w-4 text-blue-600" /> Goals by Status</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72" style={{ minHeight: 288, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={3} strokeWidth={2} stroke="#fff">
                    {statusData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} /><Legend /></PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4 text-blue-600" /> Goals by Thrust Area</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72" style={{ minHeight: 288, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={thrustData} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-blue-600" /> Quarterly Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72" style={{ minHeight: 288, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quarterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="onTrack" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="notStarted" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-blue-600" /> Department Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72" style={{ minHeight: 288, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptGoalData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                    <Legend />
                    <Bar dataKey="goals" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Goals" />
                    <Bar dataKey="employees" fill="#10b981" radius={[6, 6, 0, 0]} name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Check-in Completion Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Employee</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Q1</th>
                    <th className="px-6 py-3 font-medium">Q2</th>
                    <th className="px-6 py-3 font-medium">Q3</th>
                    <th className="px-6 py-3 font-medium">Q4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {checkinCompletion.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-3 text-gray-500">{user.role}</td>
                      <td className="px-6 py-3 text-gray-500">{user.department?.name || "N/A"}</td>
                      {["Q1", "Q2", "Q3", "Q4"].map(q => {
                        const checkin = user.checkIns?.find((c: any) => c.quarter === q);
                        return (
                          <td key={q} className="px-6 py-3">
                            {checkin ? (
                              <Badge variant="outline" className={checkin.status === "REVIEWED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                                {checkin.status}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">Pending</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
