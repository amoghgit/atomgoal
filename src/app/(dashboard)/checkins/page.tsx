import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckInsClient } from "./checkins-client";

export default async function CheckInsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const goals = await db.goal.findMany({
    where: { userId: session.user.id, status: { in: ["APPROVED", "LOCKED"] }, deletedAt: null },
    include: { checkIns: { orderBy: { quarter: "asc" } }, achievements: true },
    orderBy: { order: "asc" },
  });
  return <CheckInsClient goals={JSON.parse(JSON.stringify(goals))} userId={session.user.id} />;
}
