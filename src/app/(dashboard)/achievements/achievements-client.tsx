"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Target } from "lucide-react";
import { updateAchievement } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const statusOpts = ["NOT_STARTED", "ON_TRACK", "COMPLETED"];
const statusColors: Record<string, string> = { NOT_STARTED: "bg-gray-100 text-gray-600", ON_TRACK: "bg-blue-50 text-blue-700", COMPLETED: "bg-emerald-50 text-emerald-700" };

export function AchievementsClient({ goals }: { goals: any[] }) {
  const [selectedQuarter, setSelectedQuarter] = React.useState("Q1");
  const [editValues, setEditValues] = React.useState<Record<string, { actual: number; notes: string; status: string }>>({});
  const [saving, setSaving] = React.useState<string | null>(null);

  const getAchievement = (goal: any, q: string) => goal.achievements?.find((a: any) => a.quarter === q);

  const handleSave = async (goalId: string) => {
    const vals = editValues[goalId];
    if (!vals) return;
    setSaving(goalId);
    try {
      await updateAchievement(goalId, selectedQuarter, vals.actual, vals.notes, vals.status);
      toast.success("Achievement updated!");
    } catch { toast.error("Failed to update"); }
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievement Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Update your quarterly progress</p>
        </div>
        <div className="flex gap-2">
          {quarters.map((q) => (
            <Button key={q} variant={selectedQuarter === q ? "default" : "outline"} size="sm" className="rounded-xl" onClick={() => setSelectedQuarter(q)}>{q}</Button>
          ))}
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-16">
          <Target className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No approved goals to track yet</p>
        </CardContent></Card>
      ) : goals.map((goal: any, i: number) => {
        const achievement = getAchievement(goal, selectedQuarter);
        const vals = editValues[goal.id] || { actual: achievement?.actual || 0, notes: achievement?.notes || "", status: achievement?.status || "NOT_STARTED" };
        const progress = goal.target > 0 ? Math.min((vals.actual / goal.target) * 100, 100) : 0;

        return (
          <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{goal.thrustArea} • Target: {goal.target} • Weight: {goal.weightage}%</p>
                  </div>
                  <Badge className={cn("text-[10px]", statusColors[vals.status])}>{vals.status.replace("_", " ")}</Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-700">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Actual Value</label>
                    <Input type="number" step="any" value={vals.actual} className="mt-1 rounded-xl h-9 text-sm"
                      onChange={(e) => setEditValues({ ...editValues, [goal.id]: { ...vals, actual: parseFloat(e.target.value) || 0 } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Status</label>
                    <Select value={vals.status} onValueChange={(v) => setEditValues({ ...editValues, [goal.id]: { ...vals, status: v } })}>
                      <SelectTrigger className="mt-1 rounded-xl h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{statusOpts.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button size="sm" className="w-full rounded-xl h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs" disabled={saving === goal.id} onClick={() => handleSave(goal.id)}>
                      {saving === goal.id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
