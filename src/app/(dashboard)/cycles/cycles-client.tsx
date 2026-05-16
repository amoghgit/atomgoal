"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = { DRAFT: "bg-gray-100 text-gray-700", ACTIVE: "bg-emerald-50 text-emerald-700", LOCKED: "bg-violet-50 text-violet-700", ARCHIVED: "bg-gray-100 text-gray-500" };

export function CyclesClient({ cycles }: { cycles: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cycle Management</h1>
        <p className="text-sm text-gray-500 mt-1">Configure goal setting cycles and quarterly windows</p>
      </div>
      {cycles.length === 0 ? (
        <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-16">
          <Calendar className="h-12 w-12 text-gray-300 mb-3" /><p className="text-sm text-gray-500">No cycles configured</p>
        </CardContent></Card>
      ) : cycles.map((cycle: any, i: number) => (
        <motion.div key={cycle.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className={cn("border-gray-200 shadow-sm", cycle.isActive && "border-l-4 border-l-emerald-500")}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{cycle.name}</h3>
                    <Badge className={cn("text-[10px]", statusColors[cycle.status])}>{cycle.status}</Badge>
                    {cycle.isActive && <Badge className="text-[10px] bg-emerald-100 text-emerald-700">Active</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">FY {cycle.year} • {format(new Date(cycle.startDate), "MMM d")} - {format(new Date(cycle.endDate), "MMM d, yyyy")}</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div><p className="text-xs text-gray-500">Goals</p><p className="text-xl font-bold text-gray-900">{cycle._count?.goals || 0}</p></div>
                  <div><p className="text-xs text-gray-500">Sheets</p><p className="text-xl font-bold text-gray-900">{cycle._count?.goalSheets || 0}</p></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[{ label: "Q1", start: cycle.q1Start, end: cycle.q1End }, { label: "Q2", start: cycle.q2Start, end: cycle.q2End }, { label: "Q3", start: cycle.q3Start, end: cycle.q3End }, { label: "Q4", start: cycle.q4Start, end: cycle.q4End }].map((q) => (
                  <div key={q.label} className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs font-bold text-gray-700">{q.label}</p>
                    {q.start ? (
                      <p className="text-[10px] text-gray-500 mt-1">{format(new Date(q.start), "MMM d")} - {format(new Date(q.end), "MMM d")}</p>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-1">Not set</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
