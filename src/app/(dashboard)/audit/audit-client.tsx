"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const actionColors: Record<string, string> = {
  GOAL_CREATED: "bg-blue-50 text-blue-700", GOAL_APPROVED: "bg-emerald-50 text-emerald-700",
  GOAL_REJECTED: "bg-red-50 text-red-700", ACHIEVEMENT_UPDATED: "bg-amber-50 text-amber-700",
  GOAL_UNLOCKED: "bg-violet-50 text-violet-700",
};

export function AuditClient({ logs }: { logs: any[] }) {
  const [search, setSearch] = React.useState("");
  const [entityFilter, setEntityFilter] = React.useState("ALL");
  const entities = Array.from(new Set(logs.map((l) => l.entity)));

  const filtered = logs.filter((l) => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.actor?.name?.toLowerCase().includes(search.toLowerCase());
    const matchEntity = entityFilter === "ALL" || l.entity === entityFilter;
    return matchSearch && matchEntity;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-sm text-gray-500 mt-1">Complete history of all system actions</p>
      </div>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search actions..." className="pl-10 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Button variant={entityFilter === "ALL" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setEntityFilter("ALL")}>All</Button>
              {entities.map((e) => (
                <Button key={e} variant={entityFilter === e ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setEntityFilter(e)}>{e}</Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-12">
            <Shield className="h-10 w-10 text-gray-300 mb-2" /><p className="text-sm text-gray-500">No audit logs found</p>
          </CardContent></Card>
        ) : filtered.map((log: any, i: number) => (
          <motion.div key={log.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <Shield className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-[10px]", actionColors[log.action] || "bg-gray-100 text-gray-700")}>{log.action.replace("_", " ")}</Badge>
                    <span className="text-xs text-gray-500">{log.entity} #{log.entityId.slice(-6)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">by <strong>{log.actor?.name}</strong> ({log.actor?.role})</p>
                  {log.oldValue && <p className="text-[10px] text-gray-400 mt-0.5">Old: {log.oldValue}</p>}
                  {log.newValue && <p className="text-[10px] text-gray-400">New: {log.newValue}</p>}
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{format(new Date(log.createdAt), "MMM d, HH:mm")}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
