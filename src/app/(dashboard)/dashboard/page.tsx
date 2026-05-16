import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const userId = session.user.id;

  const whereGoals = role === "ADMIN" ? { deletedAt: null } : role === "MANAGER"
    ? { user: { managerId: userId }, deletedAt: null } : { userId, deletedAt: null };

  const [totalGoals, approvedGoals, pendingGoals, completedAchievements, recentGoals, recentNotifications, departments] = await Promise.all([
    db.goal.count({ where: whereGoals }),
    db.goal.count({ where: { ...whereGoals, status: "APPROVED" } }),
    db.goal.count({ where: { ...whereGoals, status: "SUBMITTED" } }),
    db.achievement.count({ where: role === "ADMIN" ? { status: "COMPLETED" } : { userId, status: "COMPLETED" } }),
    db.goal.findMany({
      where: whereGoals, take: 5, orderBy: { updatedAt: "desc" },
      include: { user: { select: { name: true } }, achievements: true },
    }),
    db.notification.findMany({ where: { userId }, take: 5, orderBy: { createdAt: "desc" } }),
    db.department.findMany({ include: { _count: { select: { users: true } } } }),
  ]);

  const stats = { totalGoals, approvedGoals, pendingGoals, completedAchievements };

  return (
    <DashboardClient
      stats={stats}
      recentGoals={JSON.parse(JSON.stringify(recentGoals))}
      notifications={JSON.parse(JSON.stringify(recentNotifications))}
      departments={JSON.parse(JSON.stringify(departments))}
      role={role}
      userName={session.user.name || ""}
    />
  );
}
