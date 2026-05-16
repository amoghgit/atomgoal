import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [goalsByStatus, goalsByThrust, achievementStats, departmentStats, checkinCompletion] = await Promise.all([
    db.goal.groupBy({ by: ["status"], _count: true, where: { deletedAt: null } }),
    db.goal.groupBy({ by: ["thrustArea"], _count: true, where: { deletedAt: null } }),
    db.achievement.groupBy({ by: ["quarter", "status"], _count: true }),
    db.department.findMany({ include: { users: { include: { _count: { select: { goals: true } } } } } }),
    db.user.findMany({ include: { department: true, checkIns: true } }),
  ]);

  return (
    <AnalyticsClient
      goalsByStatus={JSON.parse(JSON.stringify(goalsByStatus))}
      goalsByThrust={JSON.parse(JSON.stringify(goalsByThrust))}
      achievementStats={JSON.parse(JSON.stringify(achievementStats))}
      departmentStats={JSON.parse(JSON.stringify(departmentStats))}
      checkinCompletion={JSON.parse(JSON.stringify(checkinCompletion))}
    />
  );
}
