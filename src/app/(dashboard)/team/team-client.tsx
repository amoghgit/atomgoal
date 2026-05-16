"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit2, Users, CheckCircle, XCircle, Search, Filter, Unlock } from "lucide-react";
import { approveGoal, rejectGoal, editGoalInline, unlockGoal } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700", SUBMITTED: "bg-blue-50 text-blue-700",
  APPROVED: "bg-emerald-50 text-emerald-700", REJECTED: "bg-red-50 text-red-700",
  LOCKED: "bg-violet-50 text-violet-700",
};

export function TeamClient({ goals, role }: { goals: any[]; role: string }) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("ALL");
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedGoalId, setSelectedGoalId] = React.useState("");
  const [rejectComment, setRejectComment] = React.useState("");
  const [editTarget, setEditTarget] = React.useState<number>(0);
  const [editWeightage, setEditWeightage] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<string | null>(null);

  const filtered = goals.filter((g: any) => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || g.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (goalId: string) => {
    setLoading(goalId);
    try { await approveGoal(goalId); toast.success("Goal approved!"); } catch { toast.error("Failed to approve"); }
    setLoading(null);
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) { toast.error("Please provide a reason"); return; }
    setLoading(selectedGoalId);
    try { await rejectGoal(selectedGoalId, rejectComment); toast.success("Goal rejected"); setRejectDialogOpen(false); setRejectComment(""); } catch { toast.error("Failed"); }
    setLoading(null);
  };

  const handleEditSave = async () => {
    if (editWeightage < 10) { toast.error("Weightage must be at least 10%"); return; }
    setLoading(selectedGoalId);
    try { 
      await editGoalInline(selectedGoalId, editTarget, editWeightage); 
      toast.success("Goal updated"); 
      setEditDialogOpen(false); 
    } catch { toast.error("Failed to update"); }
    setLoading(null);
  };

  const handleUnlock = async (goalId: string) => {
    setLoading(goalId);
    try { 
      await unlockGoal(goalId); 
      toast.success("Goal unlocked for editing"); 
    } catch { toast.error("Failed to unlock goal"); }
    setLoading(null);
  };

  const pendingCount = goals.filter((g: any) => g.status === "SUBMITTED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Review</h1>
          <p className="text-sm text-gray-500 mt-1">{pendingCount} goals pending your review</p>
        </div>
        <Badge className="bg-blue-50 text-blue-700 text-sm px-3 py-1">{goals.length} total goals</Badge>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by goal or employee..." className="pl-10 rounded-xl" />
            </div>
            <div className="flex gap-2">
              {["ALL", "SUBMITTED", "APPROVED", "REJECTED"].map((s) => (
                <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilter(s)}>
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-12">
            <Users className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No goals match your filters</p>
          </CardContent></Card>
        ) : filtered.map((goal: any, i: number) => (
          <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="border-gray-200 shadow-sm card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-blue-600">{goal.user?.name}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{goal.user?.designation || goal.user?.department?.name}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{goal.thrustArea} • Target: {goal.target} • Weight: {goal.weightage}%</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={cn("text-[10px]", statusColors[goal.status])}>{goal.status.replace("_", " ")}</Badge>
                    {goal.status === "SUBMITTED" && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 text-xs" onClick={() => { setSelectedGoalId(goal.id); setEditTarget(goal.target); setEditWeightage(goal.weightage); setEditDialogOpen(true); }}>
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button size="sm" className="h-8 gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs" disabled={loading === goal.id} onClick={() => handleApprove(goal.id)}>
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs" onClick={() => { setSelectedGoalId(goal.id); setRejectDialogOpen(true); }}>
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    )}
                    {goal.status === "LOCKED" && role === "ADMIN" && (
                      <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50 text-xs" disabled={loading === goal.id} onClick={() => handleUnlock(goal.id)}>
                        <Unlock className="h-3.5 w-3.5" /> Unlock
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Reject Goal</DialogTitle></DialogHeader>
          <Textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} placeholder="Provide a reason for rejection..." rows={4} className="rounded-xl" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleReject} disabled={loading !== null} className="rounded-xl bg-red-600 hover:bg-red-700">Reject Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Edit Goal Parameters</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-gray-700">Target Value</label>
              <Input type="number" value={editTarget} onChange={(e) => setEditTarget(Number(e.target.value))} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Weightage (%)</label>
              <Input type="number" value={editWeightage} onChange={(e) => setEditWeightage(Number(e.target.value))} className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleEditSave} disabled={loading !== null} className="rounded-xl bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
