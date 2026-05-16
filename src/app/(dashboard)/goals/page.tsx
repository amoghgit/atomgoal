import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { GoalsListClient } from "./goals-list-client";

export default async function GoalsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const goals = await db.goal.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { achievements: true, progressScores: true, sharedGoal: true },
    orderBy: { order: "asc" },
  });

  const goalSheet = await db.goalSheet.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <GoalsListClient
      goals={JSON.parse(JSON.stringify(goals))}
      goalSheet={goalSheet ? JSON.parse(JSON.stringify(goalSheet)) : null}
      userId={session.user.id}
    />
  );
}
