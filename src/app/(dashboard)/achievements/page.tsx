import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AchievementsClient } from "./achievements-client";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const goals = await db.goal.findMany({
    where: { userId: session.user.id, status: { in: ["APPROVED", "LOCKED"] }, deletedAt: null },
    include: { achievements: { orderBy: { quarter: "asc" } }, progressScores: true },
    orderBy: { order: "asc" },
  });

  return <AchievementsClient goals={JSON.parse(JSON.stringify(goals))} />;
}
