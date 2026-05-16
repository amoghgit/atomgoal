"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share2, Users, Target, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SharedGoalsClient({ sharedGoals, role }: { sharedGoals: any[]; role: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shared Goals</h1>
        <p className="text-sm text-gray-500 mt-1">Departmental KPIs shared across team members</p>
      </div>
      {sharedGoals.length === 0 ? (
        <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-16">
          <Share2 className="h-12 w-12 text-gray-300 mb-3" /><h3 className="text-lg font-semibold text-gray-900">No shared goals</h3>
          <p className="text-sm text-gray-500 mt-1">Shared departmental KPIs will appear here</p>
        </CardContent></Card>
      ) : sharedGoals.map((sg: any, i: number) => (
        <motion.div key={sg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="border-gray-200 shadow-sm border-l-4 border-l-purple-500">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 gap-1"><Share2 className="h-2.5 w-2.5" /> Shared KPI</Badge>
                    <Badge variant="outline" className="text-[10px]">{sg.department?.name}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mt-2">{sg.title}</h3>
                  {sg.description && <p className="text-xs text-gray-500 mt-1">{sg.description}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="text-xl font-bold text-gray-900">{sg.target}</p>
                  <p className="text-[10px] text-gray-400 uppercase">{sg.uomType}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1"><Users className="h-3 w-3" /> Assigned to ({sg.assignments?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {(sg.assignments || []).map((a: any) => (
                    <div key={a.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[8px] bg-blue-100 text-blue-700">{a.user?.name?.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-700">{a.user?.name}</span>
                      <Badge variant="outline" className="text-[9px] h-4">{a.weightage}%</Badge>
                      {a.isPrimary && <Badge className="text-[9px] h-4 bg-amber-100 text-amber-700">Primary</Badge>}
                    </div>
                  ))}
                </div>
              </div>
              {sg.goals?.length > 0 && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><LinkIcon className="h-3 w-3" /> Linked Goals: {sg.goals.length}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
