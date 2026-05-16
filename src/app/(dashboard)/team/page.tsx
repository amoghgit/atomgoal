import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TeamClient } from "./team-client";

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role === "EMPLOYEE") redirect("/dashboard");

  const goals = await db.goal.findMany({
    where: role === "ADMIN" ? { deletedAt: null } : { user: { managerId: session.user.id }, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, designation: true, department: { select: { name: true } } } },
      achievements: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <TeamClient goals={JSON.parse(JSON.stringify(goals))} role={role} />;
}
