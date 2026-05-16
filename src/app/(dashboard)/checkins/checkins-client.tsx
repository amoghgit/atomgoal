"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, MessageSquare, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const statusColors: Record<string, string> = { PENDING: "bg-gray-100 text-gray-600", SUBMITTED: "bg-blue-50 text-blue-700", REVIEWED: "bg-emerald-50 text-emerald-700" };

export function CheckInsClient({ goals, userId }: { goals: any[]; userId: string }) {
  const [selectedQ, setSelectedQ] = React.useState("Q1");
  const [notes, setNotes] = React.useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quarterly Check-ins</h1>
          <p className="text-sm text-gray-500 mt-1">Review and document your quarterly progress</p>
        </div>
        <div className="flex gap-2">
          {quarters.map((q) => (
            <Button key={q} variant={selectedQ === q ? "default" : "outline"} size="sm" className="rounded-xl" onClick={() => setSelectedQ(q)}>{q}</Button>
          ))}
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-16">
          <Target className="h-12 w-12 text-gray-300 mb-3" /><p className="text-sm text-gray-500">No approved goals for check-in</p>
        </CardContent></Card>
      ) : goals.map((goal: any, i: number) => {
        const checkIn = goal.checkIns?.find((c: any) => c.quarter === selectedQ);
        const achievement = goal.achievements?.find((a: any) => a.quarter === selectedQ);
        return (
          <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{goal.thrustArea} • Target: {goal.target}</p>
                  </div>
                  <Badge className={cn("text-[10px]", statusColors[checkIn?.status || "PENDING"])}>{checkIn?.status || "PENDING"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3 text-center">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-[10px] text-blue-600 font-medium uppercase">Planned</p>
                    <p className="text-lg font-bold text-blue-900">{goal.target}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-[10px] text-emerald-600 font-medium uppercase">Actual</p>
                    <p className="text-lg font-bold text-emerald-900">{achievement?.actual || 0}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Progress Notes</label>
                  <Textarea value={notes[goal.id] || checkIn?.employeeNotes || ""} onChange={(e) => setNotes({ ...notes, [goal.id]: e.target.value })} placeholder="Share your progress update..." rows={2} className="mt-1.5 rounded-xl text-sm" />
                </div>
                {checkIn?.managerNotes && (
                  <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-[10px] font-semibold text-amber-700 uppercase">Manager Feedback</p>
                    <p className="text-xs text-amber-800 mt-1">{checkIn.managerNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
