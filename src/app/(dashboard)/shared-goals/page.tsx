import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SharedGoalsClient } from "./shared-goals-client";

export default async function SharedGoalsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sharedGoals = await db.sharedGoal.findMany({
    include: { department: { select: { name: true } }, assignments: { include: { user: { select: { name: true, email: true } } } }, goals: { where: { deletedAt: null }, include: { achievements: true } } },
    orderBy: { createdAt: "desc" },
  });
  return <SharedGoalsClient sharedGoals={JSON.parse(JSON.stringify(sharedGoals))} role={(session.user as any).role} />;
}
