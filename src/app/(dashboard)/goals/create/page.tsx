import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { GoalCreateClient } from "./goal-create-client";

export default async function GoalCreatePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let goalSheet = await db.goalSheet.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { goals: { where: { deletedAt: null } } },
  });

  let cycle = await db.goalCycle.findFirst({ where: { isActive: true } });
  if (!cycle) {
    cycle = await db.goalCycle.findFirst({ orderBy: { createdAt: "desc" } });
  }

  if (!goalSheet && cycle) {
    goalSheet = await db.goalSheet.create({
      data: { userId: session.user.id, cycleId: cycle.id },
      include: { goals: { where: { deletedAt: null } } },
    });
  }

  const existingGoals = goalSheet?.goals || [];
  const totalWeight = existingGoals.reduce((s, g) => s + g.weightage, 0);

  return (
    <GoalCreateClient
      userId={session.user.id}
      cycleId={cycle?.id || ""}
      goalSheetId={goalSheet?.id || ""}
      existingGoalCount={existingGoals.length}
      currentTotalWeight={totalWeight}
    />
  );
}
