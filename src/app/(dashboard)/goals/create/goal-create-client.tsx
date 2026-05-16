"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, Save, AlertCircle } from "lucide-react";
import { createGoal } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const goalSchema = z.object({
  thrustArea: z.string().min(1, "Thrust area is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  uomType: z.enum(["NUMERIC", "PERCENTAGE", "TIMELINE", "ZERO_BASED"]),
  isHigherBetter: z.boolean().default(true),
  target: z.number().positive("Target must be positive"),
  weightage: z.number().min(10, "Min weightage is 10%").max(100, "Max weightage is 100%"),
});

type GoalFormData = z.infer<typeof goalSchema>;

const thrustAreas = ["Revenue Growth", "Customer Satisfaction", "Innovation", "Operational Excellence", "People Development", "Digital Transformation", "Quality Improvement", "Cost Optimization"];

interface GoalCreateClientProps {
  userId: string; cycleId: string; goalSheetId: string;
  existingGoalCount: number; currentTotalWeight: number;
}

export function GoalCreateClient({ userId, cycleId, goalSheetId, existingGoalCount, currentTotalWeight }: GoalCreateClientProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema) as any,
    defaultValues: { thrustArea: "", title: "", description: "", uomType: "NUMERIC", isHigherBetter: true, target: 0, weightage: 10 },
  });

  const watchedWeight = watch("weightage") || 0;
  const projectedTotal = currentTotalWeight + watchedWeight;
  const maxGoalsReached = existingGoalCount >= 8;

  const onSubmit = async (data: any) => {
    if (maxGoalsReached) { toast.error("Maximum 8 goals allowed"); return; }
    if (projectedTotal > 100) { toast.error("Total weightage would exceed 100%"); return; }

    setSaving(true);
    try {
      await createGoal({ ...data, userId, cycleId, goalSheetId });
      toast.success("Goal created successfully!");
      router.push("/goals");
    } catch (e: any) {
      toast.error(e.message || "Failed to create goal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Create New Goal</h1>
        <p className="text-sm text-gray-500 mt-1">Define your performance objective</p>
      </motion.div>

      {/* Weightage Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Weightage Budget</span>
              <span className={cn("text-sm font-bold", projectedTotal === 100 ? "text-emerald-600" : projectedTotal > 100 ? "text-red-600" : "text-gray-700")}>
                {currentTotalWeight}% used + {watchedWeight}% = {projectedTotal}%
              </span>
            </div>
            <Progress value={Math.min(projectedTotal, 100)} className={cn("h-2.5", projectedTotal > 100 && "[&>div]:bg-red-500")} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Goals: {existingGoalCount}/8</span>
              <span className="text-xs text-gray-500">Remaining: {Math.max(100 - projectedTotal, 0)}%</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {maxGoalsReached && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-700">Maximum 8 goals reached. Remove a goal to add more.</p>
        </div>
      )}

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-blue-600" /> Goal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-gray-700">Thrust Area *</Label>
                <Select onValueChange={(v: any) => setValue("thrustArea", v as string)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select thrust area" /></SelectTrigger>
                  <SelectContent>
                    {thrustAreas.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.thrustArea && <p className="mt-1 text-xs text-red-600">{errors.thrustArea.message}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Goal Title *</Label>
                <Input {...register("title")} className="mt-1.5 rounded-xl" placeholder="e.g., Increase quarterly revenue by 20%" />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea {...register("description")} className="mt-1.5 rounded-xl" placeholder="Add detailed context..." rows={3} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">UoM Type *</Label>
                  <Select defaultValue="NUMERIC" onValueChange={(v) => setValue("uomType", v as any)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NUMERIC">Numeric</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="TIMELINE">Timeline</SelectItem>
                      <SelectItem value="ZERO_BASED">Zero-based</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.uomType && <p className="mt-1 text-xs text-red-600">{errors.uomType.message}</p>}
                </div>
                {(watch("uomType") === "NUMERIC" || watch("uomType") === "PERCENTAGE") && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Target Direction *</Label>
                    <Select defaultValue="true" onValueChange={(v) => setValue("isHigherBetter", v === "true")}>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Min (Higher is Better)</SelectItem>
                        <SelectItem value="false">Max (Lower is Better)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Target *</Label>
                  <Input type="number" step="any" {...register("target", { valueAsNumber: true })} className="mt-1.5 rounded-xl" placeholder="100" />
                  {errors.target && <p className="mt-1 text-xs text-red-600">{errors.target.message}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Weightage (%) *</Label>
                  <Input type="number" {...register("weightage", { valueAsNumber: true })} className="mt-1.5 rounded-xl" placeholder="10-100" min={10} max={100} />
                  {errors.weightage && <p className="mt-1 text-xs text-red-600">{errors.weightage.message}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => router.push("/goals")}>Cancel</Button>
                <Button type="submit" disabled={saving || maxGoalsReached} className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-200">
                  <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
