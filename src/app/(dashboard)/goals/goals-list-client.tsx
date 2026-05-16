"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Send, Lock, Share2, Trash2 } from "lucide-react";
import { submitGoals, deleteGoal } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700", SUBMITTED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700", APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700", LOCKED: "bg-violet-50 text-violet-700",
};

const uomLabels: Record<string, string> = {
  NUMERIC: "Number", PERCENTAGE: "%", TIMELINE: "Date", ZERO_BASED: "Zero",
};

interface GoalsListClientProps {
  goals: any[];
  goalSheet: any;
  userId: string;
}

export function GoalsListClient({ goals, goalSheet, userId }: GoalsListClientProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const totalWeight = goals.reduce((s: number, g: any) => s + g.weightage, 0);
  const canSubmit = goalSheet && goalSheet.status === "DRAFT" && totalWeight === 100 && goals.length > 0;
  const isEditable = !goalSheet || goalSheet.status === "DRAFT" || goalSheet.status === "REJECTED";

  const handleSubmit = async () => {
    if (!goalSheet) return;
    setSubmitting(true);
    try {
      await submitGoals(goalSheet.id);
      toast.success("Goals submitted for review!");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(id);
      toast.success("Goal deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your performance goals</p>
        </div>
        <div className="flex items-center gap-3">
          {canSubmit && (
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-200">
              <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit All Goals"}
            </Button>
          )}
          {isEditable && (
            <Link href="/goals/create">
              <Button variant="outline" className="gap-2 rounded-xl">
                <Plus className="h-4 w-4" /> Add Goal
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Weightage Progress */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Total Weightage</span>
            <span className={cn("text-sm font-bold", totalWeight === 100 ? "text-emerald-600" : totalWeight > 100 ? "text-red-600" : "text-amber-600")}>
              {totalWeight}% / 100%
            </span>
          </div>
          <Progress value={Math.min(totalWeight, 100)} className="h-2.5" />
          {totalWeight !== 100 && goals.length > 0 && (
            <p className="mt-2 text-xs text-amber-600">
              {totalWeight < 100 ? `Add ${100 - totalWeight}% more weightage to submit` : `Reduce weightage by ${totalWeight - 100}%`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No goals yet</h3>
            <p className="text-sm text-gray-500 mt-1">Create your first goal to get started</p>
            <Link href="/goals/create">
              <Button className="mt-4 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="h-4 w-4" /> Create Goal
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal: any, i: number) => {
            const latestAchievement = goal.achievements?.[goal.achievements.length - 1];
            const progressPct = latestAchievement ? Math.min((latestAchievement.actual / goal.target) * 100, 100) : 0;
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-gray-200 shadow-sm card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                          <Badge className={cn("text-[10px]", statusColors[goal.status])}>{goal.status.replace("_", " ")}</Badge>
                          {goal.isShared && (
                            <Badge variant="outline" className="text-[10px] gap-1 bg-purple-50 text-purple-700 border-purple-200">
                              <Share2 className="h-2.5 w-2.5" /> Shared
                            </Badge>
                          )}
                          {goal.status === "LOCKED" && <Lock className="h-3.5 w-3.5 text-violet-500" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{goal.thrustArea}</p>
                        {goal.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{goal.description}</p>}
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="text-lg font-bold text-gray-900">{goal.weightage}%</p>
                      </div>
                      {isEditable && !goal.isShared && (
                        <div className="ml-2 pl-2 border-l border-gray-100 flex items-center">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-lg bg-gray-50 p-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">UoM</p>
                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{uomLabels[goal.uomType]}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Target</p>
                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{goal.target}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Progress</p>
                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{progressPct.toFixed(0)}%</p>
                      </div>
                    </div>
                    {latestAchievement && (
                      <div className="mt-3">
                        <Progress value={progressPct} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
