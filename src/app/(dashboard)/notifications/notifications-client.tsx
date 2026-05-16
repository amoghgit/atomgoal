"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Target, AlertTriangle, Users, Info } from "lucide-react";
import { markNotificationRead } from "@/lib/actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = { GOAL_SUBMITTED: Target, GOAL_APPROVED: CheckCircle, GOAL_REJECTED: AlertTriangle, ESCALATION: AlertTriangle, CHECKIN_REMINDER: Bell, SHARED_GOAL: Users, SYSTEM: Info };
const typeColors: Record<string, string> = { GOAL_SUBMITTED: "text-blue-600", GOAL_APPROVED: "text-emerald-600", GOAL_REJECTED: "text-red-600", ESCALATION: "text-amber-600", CHECKIN_REMINDER: "text-violet-600", SHARED_GOAL: "text-purple-600", SYSTEM: "text-gray-600" };

export function NotificationsClient({ notifications }: { notifications: any[] }) {
  const handleMarkRead = async (id: string) => {
    try { await markNotificationRead(id); toast.success("Marked as read"); } catch { toast.error("Failed"); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">{unreadCount} unread notifications</p>
        </div>
      </div>
      {notifications.length === 0 ? (
        <Card className="border-gray-200"><CardContent className="flex flex-col items-center py-16">
          <Bell className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No notifications yet</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: any, i: number) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={cn("border-gray-200 shadow-sm transition-colors", !n.isRead && "border-l-4 border-l-blue-500 bg-blue-50/30")}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn("mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100", typeColors[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        {!n.isRead && <Badge className="bg-blue-100 text-blue-700 text-[9px]">NEW</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{format(new Date(n.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                    {!n.isRead && (
                      <Button variant="ghost" size="sm" className="text-xs rounded-xl" onClick={() => handleMarkRead(n.id)}>Mark read</Button>
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
