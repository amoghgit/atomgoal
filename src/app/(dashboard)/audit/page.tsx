import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AuditClient } from "./audit-client";

export default async function AuditPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as any).role !== "ADMIN") redirect("/dashboard");

  const logs = await db.auditLog.findMany({
    include: { actor: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" }, take: 200,
  });
  return <AuditClient logs={JSON.parse(JSON.stringify(logs))} />;
}
