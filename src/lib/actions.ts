"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { UomType, Quarter, AchievementStatus } from "@prisma/client";

export async function getSession() {
  return await auth();
}

export async function getDashboardStats(userId: string, role: string) {
  const where = role === "ADMIN" ? {} : role === "MANAGER"
    ? { user: { managerId: userId } }
    : { userId };

  const [totalGoals, approved, pending, completed] = await Promise.all([
    db.goal.count({ where: { ...where, deletedAt: null } }),
    db.goal.count({ where: { ...where, status: "APPROVED", deletedAt: null } }),
    db.goal.count({ where: { ...where, status: "SUBMITTED", deletedAt: null } }),
    db.achievement.count({ where: { ...(role === "ADMIN" ? {} : { userId }), status: "COMPLETED" } }),
  ]);

  return { totalGoals, approved, pending, completed };
}

export async function getGoalsForUser(userId: string) {
  return db.goal.findMany({
    where: { userId, deletedAt: null },
    include: { achievements: true, progressScores: true, sharedGoal: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTeamGoals(managerId: string) {
  return db.goal.findMany({
    where: { user: { managerId }, deletedAt: null },
    include: { user: { select: { id: true, name: true, email: true, designation: true } }, achievements: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGoal(data: {
  userId: string; cycleId: string; goalSheetId: string; thrustArea: string;
  title: string; description?: string; uomType: string; isHigherBetter?: boolean; target: number; weightage: number;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const goal = await db.goal.create({
    data: {
      userId: data.userId,
      cycleId: data.cycleId,
      goalSheetId: data.goalSheetId,
      thrustArea: data.thrustArea,
      title: data.title,
      description: data.description,
      uomType: data.uomType as UomType,
      isHigherBetter: data.isHigherBetter ?? true,
      target: data.target,
      weightage: data.weightage,
      status: "DRAFT",
    },
  });

  await db.auditLog.create({
    data: { actorId: session.user.id, action: "GOAL_CREATED", entity: "Goal", entityId: goal.id },
  });

  revalidatePath("/goals");
  return goal;
}

export async function submitGoals(goalSheetId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.$transaction(async (tx) => {
    const sheet = await tx.goalSheet.findUnique({
      where: { id: goalSheetId },
      include: { goals: { where: { deletedAt: null } } },
    });
    if (!sheet) throw new Error("Goal sheet not found");

    const totalWeight = sheet.goals.reduce((sum, g) => sum + g.weightage, 0);
    if (totalWeight !== 100) throw new Error("Total weightage must equal 100%");

    await tx.goalSheet.update({
      where: { id: goalSheetId },
      data: { status: "SUBMITTED", submittedAt: new Date() },
    });

    await tx.goal.updateMany({
      where: { goalSheetId, deletedAt: null },
      data: { status: "SUBMITTED" },
    });

    const manager = await tx.user.findUnique({ where: { id: sheet.userId }, select: { managerId: true } });
    if (manager?.managerId) {
      await tx.notification.create({
        data: {
          userId: manager.managerId,
          title: "Goals Submitted for Review",
          message: `An employee has submitted their goals for your approval.`,
          type: "GOAL_SUBMITTED",
          link: "/team",
        },
      });
    }
  });

  revalidatePath("/goals");
  revalidatePath("/team");
}

export async function approveGoal(goalId: string, comment?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.$transaction(async (tx) => {
    const goal = await tx.goal.update({ where: { id: goalId }, data: { status: "APPROVED" } });
    await tx.approval.create({
      data: { goalId, approverId: session.user.id, action: "APPROVED", comment },
    });
    await tx.notification.create({
      data: { userId: goal.userId, title: "Goal Approved", message: `Your goal "${goal.title}" has been approved.`, type: "GOAL_APPROVED", link: "/goals" },
    });
    await tx.auditLog.create({
      data: { actorId: session.user.id, action: "GOAL_APPROVED", entity: "Goal", entityId: goalId },
    });
  });

  revalidatePath("/goals");
  revalidatePath("/team");
}

export async function rejectGoal(goalId: string, comment: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.$transaction(async (tx) => {
    const goal = await tx.goal.update({ where: { id: goalId }, data: { status: "REJECTED" } });
    await tx.approval.create({
      data: { goalId, approverId: session.user.id, action: "REJECTED", comment },
    });
    await tx.notification.create({
      data: { userId: goal.userId, title: "Goal Rejected", message: `Your goal "${goal.title}" was returned: ${comment}`, type: "GOAL_REJECTED", link: "/goals" },
    });
    await tx.auditLog.create({
      data: { actorId: session.user.id, action: "GOAL_REJECTED", entity: "Goal", entityId: goalId, newValue: comment },
    });
  });

  revalidatePath("/goals");
  revalidatePath("/team");
}

export async function updateAchievement(goalId: string, quarter: string, actual: number, notes?: string, status?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const goal = await db.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw new Error("Goal not found");

  const goalsToUpdate = [goal];
  
  if (goal.isShared && goal.isPrimaryOwner && goal.sharedGoalId) {
    const linkedGoals = await db.goal.findMany({ 
      where: { sharedGoalId: goal.sharedGoalId, id: { not: goalId } } 
    });
    goalsToUpdate.push(...linkedGoals);
  }

  for (const g of goalsToUpdate) {
    const achievement = await db.achievement.upsert({
      where: { goalId_quarter: { goalId: g.id, quarter: quarter as Quarter } },
      update: { actual, notes, status: (status as AchievementStatus) || "ON_TRACK" },
      create: { goalId: g.id, userId: g.userId, quarter: quarter as Quarter, actual, notes, status: (status as AchievementStatus) || "ON_TRACK" },
    });

    let score = 0;
    if (g.uomType === "NUMERIC" || g.uomType === "PERCENTAGE") {
      if (g.isHigherBetter) {
        score = Math.min((actual / g.target) * 100, 100);
      } else {
        score = Math.min((g.target / (actual === 0 ? 0.001 : actual)) * 100, 100);
      }
    } else if (g.uomType === "ZERO_BASED") {
      score = actual === 0 ? 100 : 0;
    } else if (g.uomType === "TIMELINE") {
      score = actual <= g.target ? 100 : Math.max(0, 100 - ((actual - g.target) / g.target) * 100);
    }

    await db.progressScore.upsert({
      where: { id: `${g.id}-${quarter}` },
      update: { score, weightedScore: (score * g.weightage) / 100 },
      create: { id: `${g.id}-${quarter}`, goalId: g.id, quarter: quarter as Quarter, score, weightedScore: (score * g.weightage) / 100 },
    });

    if (g.id === goalId) {
      await db.auditLog.create({
        data: { actorId: session.user.id, action: "ACHIEVEMENT_UPDATED", entity: "Achievement", entityId: achievement.id, newValue: JSON.stringify({ actual, notes }) },
      });
    }
  }

  revalidatePath("/achievements");
  revalidatePath("/goals");
  return { success: true };
}

export async function getNotifications(userId: string) {
  return db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
}

export async function markNotificationRead(id: string) {
  await db.notification.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/notifications");
}

export async function getAuditLogs(filters?: { entity?: string; actorId?: string }) {
  return db.auditLog.findMany({
    where: { ...(filters?.entity && { entity: filters.entity }), ...(filters?.actorId && { actorId: filters.actorId }) },
    include: { actor: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getEscalations(userId: string, role: string) {
  const where = role === "ADMIN" ? {} : { toUserId: userId };
  return db.escalation.findMany({
    where,
    include: { fromUser: { select: { name: true, email: true } }, toUser: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAnalyticsData() {
  const [goalsByStatus, goalsByDept, achievementsByQuarter] = await Promise.all([
    db.goal.groupBy({ by: ["status"], _count: true, where: { deletedAt: null } }),
    db.goal.groupBy({ by: ["thrustArea"], _count: true, where: { deletedAt: null } }),
    db.achievement.groupBy({ by: ["quarter", "status"], _count: true }),
  ]);

  return { goalsByStatus, goalsByDept, achievementsByQuarter };
}

export async function editGoalInline(goalId: string, target: number, weightage: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") throw new Error("Forbidden");

  const goal = await db.goal.update({
    where: { id: goalId },
    data: { target, weightage },
  });

  await db.auditLog.create({
    data: { actorId: session.user.id, action: "GOAL_EDITED", entity: "Goal", entityId: goalId, newValue: JSON.stringify({ target, weightage }) },
  });

  revalidatePath("/team");
  return goal;
}

export async function exportReport(reportId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  let csv = "";
  if (reportId === "achievement") {
    const goals = await db.goal.findMany({
      include: { user: true, achievements: true },
      where: { deletedAt: null }
    });
    csv = "Employee,Email,Goal Title,Thrust Area,UoM,Target,Weightage,Q1 Actual,Q2 Actual,Q3 Actual,Q4 Actual\n";
    goals.forEach(g => {
      const q1 = g.achievements.find(a => a.quarter === "Q1")?.actual || 0;
      const q2 = g.achievements.find(a => a.quarter === "Q2")?.actual || 0;
      const q3 = g.achievements.find(a => a.quarter === "Q3")?.actual || 0;
      const q4 = g.achievements.find(a => a.quarter === "Q4")?.actual || 0;
      csv += `${g.user.name},${g.user.email},"${g.title}",${g.thrustArea},${g.uomType},${g.target},${g.weightage},${q1},${q2},${q3},${q4}\n`;
    });
  } else {
    // Basic fallback for other reports
    csv = "Report ID,Generated At\n";
    csv += `${reportId},${new Date().toISOString()}\n`;
  }
  return csv;
}

export async function unlockGoal(goalId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Forbidden");

  const goal = await db.goal.update({
    where: { id: goalId },
    data: { status: "DRAFT" },
  });

  await db.auditLog.create({
    data: { actorId: session.user.id, action: "GOAL_UNLOCKED", entity: "Goal", entityId: goalId },
  });

  revalidatePath("/team");
  revalidatePath("/goals");
  return goal;
}

export async function deleteGoal(goalId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Only allow deleting DRAFT or REJECTED goals (and ensure it's the owner's goal)
  const goal = await db.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw new Error("Goal not found");
  if (goal.userId !== session.user.id) throw new Error("Forbidden");
  if (goal.status !== "DRAFT" && goal.status !== "REJECTED") {
    throw new Error("Only Draft or Rejected goals can be deleted");
  }
  if (goal.isShared) throw new Error("Cannot delete a shared goal");

  await db.goal.update({
    where: { id: goalId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/goals");
}
