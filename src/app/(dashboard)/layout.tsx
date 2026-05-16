import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const notificationCount = await db.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  }).catch(() => 0);

  return (
    <DashboardShell
      user={{
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).role || "EMPLOYEE",
        designation: (session.user as any).designation,
        departmentName: (session.user as any).departmentName,
      }}
      notificationCount={notificationCount}
    >
      {children}
    </DashboardShell>
  );
}
