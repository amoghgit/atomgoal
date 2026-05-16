import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { EscalationsClient } from "./escalations-client";

export default async function EscalationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role === "EMPLOYEE") redirect("/dashboard");

  const escalations = await db.escalation.findMany({
    where: role === "ADMIN" ? {} : { toUserId: session.user.id },
    include: { fromUser: { select: { name: true, email: true, department: { select: { name: true } } } }, toUser: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return <EscalationsClient escalations={JSON.parse(JSON.stringify(escalations))} />;
}
