"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle2, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = { OPEN: "bg-red-50 text-red-700 border-red-200", ACKNOWLEDGED: "bg-amber-50 text-amber-700 border-amber-200", RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200" };
const typeLabels: Record<string, string> = { GOAL_NOT_SUBMITTED: "Goal Not Submitted", APPROVAL_PENDING: "Approval Pending", CHECKIN_INCOMPLETE: "Check-in Incomplete" };

export function EscalationsClient({ escalations }: { escalations: any[] }) {
  const openCount = escalations.filter((e) => e.status === "OPEN").length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escalations</h1>
        <p className="text-sm text-gray-500 mt-1">{openCount} open escalations requiring attention</p>
      </div>
      {escalations.length === 0 ? (
        <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-16">
          <CheckCircle2 className="h-12 w-12 text-emerald-300 mb-3" /><h3 className="text-lg font-semibold text-gray-900">All clear!</h3><p className="text-sm text-gray-500 mt-1">No escalations at the moment</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {escalations.map((esc: any, i: number) => (
            <motion.div key={esc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={cn("border-gray-200 shadow-sm", esc.status === "OPEN" && "border-l-4 border-l-red-500")}>
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", esc.status === "OPEN" ? "bg-red-100" : "bg-gray-100")}>
                    <AlertTriangle className={cn("h-5 w-5", esc.status === "OPEN" ? "text-red-600" : "text-gray-400")} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[esc.status])}>{esc.status}</Badge>
                      <Badge variant="outline" className="text-[10px] bg-gray-50">{typeLabels[esc.type]}</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{esc.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> From: {esc.fromUser?.name}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(esc.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
