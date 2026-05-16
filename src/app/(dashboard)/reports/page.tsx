"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, Users, Target, Calendar } from "lucide-react";
import { toast } from "sonner";
import { exportReport } from "@/lib/actions";

const reports = [
  { id: "achievement", title: "Achievement Report", desc: "Individual and team goal achievements by quarter", icon: Target, color: "from-blue-500 to-blue-600" },
  { id: "quarterly", title: "Quarterly Completion", desc: "Completion rates across all quarters", icon: Calendar, color: "from-emerald-500 to-emerald-600" },
  { id: "team", title: "Team Progress Report", desc: "Consolidated team performance metrics", icon: Users, color: "from-amber-500 to-amber-600" },
  { id: "department", title: "Department Analytics", desc: "Department-level performance breakdown", icon: BarChart3, color: "from-violet-500 to-violet-600" },
];

export default function ReportsPage() {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleExport = async (reportId: string, format: string) => {
    if (format !== "csv") {
      toast.error("Only CSV export is currently supported");
      return;
    }
    setLoading(reportId);
    toast.info(`Generating ${reportId} report...`);
    try {
      const csv = await exportReport(reportId);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportId}_report_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export successful!");
    } catch (e) {
      toast.error("Failed to generate report");
    }
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and export performance reports</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.id} className="border-gray-200 shadow-sm card-hover">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{r.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-7 gap-1.5 rounded-lg text-[11px]" onClick={() => handleExport(r.id, "csv")} disabled={loading === r.id}>
                        <Download className="h-3 w-3" /> CSV
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 gap-1.5 rounded-lg text-[11px]" onClick={() => handleExport(r.id, "excel")} disabled={loading === r.id}>
                        <Download className="h-3 w-3" /> Excel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
