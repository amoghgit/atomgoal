import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CyclesClient } from "./cycles-client";

export default async function CyclesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as any).role !== "ADMIN") redirect("/dashboard");

  const cycles = await db.goalCycle.findMany({ orderBy: { year: "desc" }, include: { _count: { select: { goals: true, goalSheets: true } } } });
  return <CyclesClient cycles={JSON.parse(JSON.stringify(cycles))} />;
}
