import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || "file:dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.progressScore.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.escalation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.goalSheet.deleteMany();
  await prisma.sharedGoalAssignment.deleteMany();
  await prisma.sharedGoal.deleteMany();
  await prisma.goalCycle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.department.deleteMany();

  // Departments
  const engineering = await prisma.department.create({ data: { name: "Engineering", code: "ENG", description: "Software Engineering" } });
  const product = await prisma.department.create({ data: { name: "Product", code: "PROD", description: "Product Management" } });
  const hr = await prisma.department.create({ data: { name: "Human Resources", code: "HR", description: "People Operations" } });
  const sales = await prisma.department.create({ data: { name: "Sales", code: "SALES", description: "Revenue & Sales" } });

  // Teams
  const feTeam = await prisma.team.create({ data: { name: "Frontend", departmentId: engineering.id } });
  const beTeam = await prisma.team.create({ data: { name: "Backend", departmentId: engineering.id } });

  // Admin
  const admin = await prisma.user.create({
    data: { email: "anita.desai@atomgoal.com", name: "Anita Desai", role: "ADMIN", departmentId: hr.id, designation: "HR Director", employeeCode: "AG001" },
  });

  // Managers
  const manager1 = await prisma.user.create({
    data: { email: "rajesh.kumar@atomgoal.com", name: "Rajesh Kumar", role: "MANAGER", departmentId: engineering.id, teamId: feTeam.id, designation: "Engineering Manager", employeeCode: "AG002" },
  });
  const manager2 = await prisma.user.create({
    data: { email: "sunita.patel@atomgoal.com", name: "Sunita Patel", role: "MANAGER", departmentId: sales.id, designation: "Sales Director", employeeCode: "AG003" },
  });

  // Employees
  const emp1 = await prisma.user.create({
    data: { email: "priya.sharma@atomgoal.com", name: "Priya Sharma", role: "EMPLOYEE", departmentId: engineering.id, teamId: feTeam.id, managerId: manager1.id, designation: "Software Engineer", employeeCode: "AG004" },
  });
  const emp2 = await prisma.user.create({
    data: { email: "arjun.mehta@atomgoal.com", name: "Arjun Mehta", role: "EMPLOYEE", departmentId: engineering.id, teamId: beTeam.id, managerId: manager1.id, designation: "Senior Developer", employeeCode: "AG005" },
  });
  const emp3 = await prisma.user.create({
    data: { email: "kavita.singh@atomgoal.com", name: "Kavita Singh", role: "EMPLOYEE", departmentId: sales.id, managerId: manager2.id, designation: "Account Executive", employeeCode: "AG006" },
  });
  const emp4 = await prisma.user.create({
    data: { email: "vikram.joshi@atomgoal.com", name: "Vikram Joshi", role: "EMPLOYEE", departmentId: product.id, managerId: manager1.id, designation: "Product Analyst", employeeCode: "AG007" },
  });

  // Goal Cycle
  const cycle = await prisma.goalCycle.create({
    data: {
      name: "FY 2025-26", year: 2025, startDate: new Date("2025-04-01"), endDate: new Date("2026-03-31"),
      goalSettingStart: new Date("2025-05-01"), goalSettingEnd: new Date("2025-05-31"),
      q1Start: new Date("2025-07-01"), q1End: new Date("2025-07-31"),
      q2Start: new Date("2025-10-01"), q2End: new Date("2025-10-31"),
      q3Start: new Date("2026-01-01"), q3End: new Date("2026-01-31"),
      q4Start: new Date("2026-03-01"), q4End: new Date("2026-04-15"),
      status: "ACTIVE", isActive: true,
    },
  });

  // Goal Sheets & Goals for Priya (Employee)
  const sheet1 = await prisma.goalSheet.create({
    data: { userId: emp1.id, cycleId: cycle.id, status: "APPROVED", totalWeight: 100, submittedAt: new Date("2025-05-10"), approvedAt: new Date("2025-05-15") },
  });

  const g1 = await prisma.goal.create({
    data: { goalSheetId: sheet1.id, userId: emp1.id, cycleId: cycle.id, thrustArea: "Innovation", title: "Build Component Library", description: "Create a reusable React component library for the design system", uomType: "NUMERIC", target: 50, weightage: 30, status: "APPROVED", order: 1 },
  });
  const g2 = await prisma.goal.create({
    data: { goalSheetId: sheet1.id, userId: emp1.id, cycleId: cycle.id, thrustArea: "Quality Improvement", title: "Reduce Bug Rate", description: "Reduce production bugs by improving code quality and testing", uomType: "PERCENTAGE", target: 30, weightage: 25, status: "APPROVED", order: 2 },
  });
  const g3 = await prisma.goal.create({
    data: { goalSheetId: sheet1.id, userId: emp1.id, cycleId: cycle.id, thrustArea: "People Development", title: "Mentor Junior Developers", description: "Conduct weekly mentoring sessions for 2 junior developers", uomType: "NUMERIC", target: 40, weightage: 20, status: "APPROVED", order: 3 },
  });
  const g4 = await prisma.goal.create({
    data: { goalSheetId: sheet1.id, userId: emp1.id, cycleId: cycle.id, thrustArea: "Operational Excellence", title: "CI/CD Pipeline Optimization", description: "Reduce deployment time and improve pipeline reliability", uomType: "PERCENTAGE", target: 50, weightage: 25, status: "APPROVED", order: 4 },
  });

  // Achievements for Priya
  await prisma.achievement.createMany({
    data: [
      { goalId: g1.id, userId: emp1.id, quarter: "Q1", actual: 18, status: "ON_TRACK", notes: "Built 18 components so far" },
      { goalId: g1.id, userId: emp1.id, quarter: "Q2", actual: 35, status: "ON_TRACK", notes: "Steady progress" },
      { goalId: g2.id, userId: emp1.id, quarter: "Q1", actual: 12, status: "ON_TRACK", notes: "Bug rate reduced" },
      { goalId: g3.id, userId: emp1.id, quarter: "Q1", actual: 10, status: "ON_TRACK", notes: "Weekly sessions started" },
      { goalId: g4.id, userId: emp1.id, quarter: "Q1", actual: 20, status: "ON_TRACK", notes: "Pipeline improvements underway" },
    ],
  });

  // Goals for Arjun (Submitted - pending approval)
  const sheet2 = await prisma.goalSheet.create({
    data: { userId: emp2.id, cycleId: cycle.id, status: "SUBMITTED", totalWeight: 100, submittedAt: new Date("2025-05-12") },
  });
  await prisma.goal.createMany({
    data: [
      { goalSheetId: sheet2.id, userId: emp2.id, cycleId: cycle.id, thrustArea: "Revenue Growth", title: "API Performance Optimization", uomType: "PERCENTAGE", target: 40, weightage: 30, status: "SUBMITTED", order: 1 },
      { goalSheetId: sheet2.id, userId: emp2.id, cycleId: cycle.id, thrustArea: "Innovation", title: "Microservices Migration", uomType: "NUMERIC", target: 5, weightage: 35, status: "SUBMITTED", order: 2 },
      { goalSheetId: sheet2.id, userId: emp2.id, cycleId: cycle.id, thrustArea: "Quality Improvement", title: "Test Coverage Improvement", uomType: "PERCENTAGE", target: 80, weightage: 35, status: "SUBMITTED", order: 3 },
    ],
  });

  // Goals for Kavita (Draft)
  const sheet3 = await prisma.goalSheet.create({
    data: { userId: emp3.id, cycleId: cycle.id, status: "DRAFT", totalWeight: 60 },
  });
  await prisma.goal.createMany({
    data: [
      { goalSheetId: sheet3.id, userId: emp3.id, cycleId: cycle.id, thrustArea: "Revenue Growth", title: "Q1 Sales Target", uomType: "NUMERIC", target: 500000, weightage: 30, status: "DRAFT", order: 1 },
      { goalSheetId: sheet3.id, userId: emp3.id, cycleId: cycle.id, thrustArea: "Customer Satisfaction", title: "Client Retention Rate", uomType: "PERCENTAGE", target: 95, weightage: 30, status: "DRAFT", order: 2 },
    ],
  });

  // Shared Goal
  const sharedGoal = await prisma.sharedGoal.create({
    data: {
      title: "Platform Uptime SLA", description: "Maintain 99.9% platform uptime across all services",
      thrustArea: "Operational Excellence", uomType: "PERCENTAGE", target: 99.9,
      departmentId: engineering.id, primaryOwnerId: emp1.id,
    },
  });
  await prisma.sharedGoalAssignment.createMany({
    data: [
      { sharedGoalId: sharedGoal.id, userId: emp1.id, weightage: 15, isPrimary: true },
      { sharedGoalId: sharedGoal.id, userId: emp2.id, weightage: 15, isPrimary: false },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: manager1.id, title: "Goals Submitted", message: "Arjun Mehta has submitted goals for your review.", type: "GOAL_SUBMITTED", link: "/team" },
      { userId: emp1.id, title: "Goals Approved", message: "Your goals for FY 2025-26 have been approved by Rajesh Kumar.", type: "GOAL_APPROVED", isRead: true, link: "/goals" },
      { userId: emp1.id, title: "Q1 Check-in Reminder", message: "Please complete your Q1 check-in before July 31.", type: "CHECKIN_REMINDER", link: "/checkins" },
      { userId: manager1.id, title: "Escalation Alert", message: "Kavita Singh has not submitted goals within the deadline.", type: "ESCALATION", link: "/escalations" },
      { userId: admin.id, title: "System Update", message: "FY 2025-26 cycle has been activated.", type: "SYSTEM" },
      { userId: emp2.id, title: "Shared Goal Assigned", message: "You have been assigned to the Platform Uptime SLA shared goal.", type: "SHARED_GOAL", link: "/shared-goals" },
    ],
  });

  // Escalations
  await prisma.escalation.createMany({
    data: [
      { type: "GOAL_NOT_SUBMITTED", fromUserId: emp3.id, toUserId: manager2.id, reason: "Kavita Singh has not submitted goals — 5 days past deadline", status: "OPEN" },
      { type: "APPROVAL_PENDING", fromUserId: emp2.id, toUserId: manager1.id, reason: "Arjun Mehta's goals pending approval for 3 days", status: "ACKNOWLEDGED" },
    ],
  });

  // Check-ins
  await prisma.checkIn.createMany({
    data: [
      { goalId: g1.id, userId: emp1.id, quarter: "Q1", employeeNotes: "Built 18 components, on track for 50 by year end", status: "REVIEWED", managerNotes: "Good progress, focus on documentation", submittedAt: new Date("2025-07-20"), reviewedAt: new Date("2025-07-25") },
      { goalId: g2.id, userId: emp1.id, quarter: "Q1", employeeNotes: "Bug rate down 12%, implemented code review process", status: "SUBMITTED", submittedAt: new Date("2025-07-22") },
    ],
  });

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actorId: emp1.id, action: "GOAL_CREATED", entity: "Goal", entityId: g1.id },
      { actorId: emp1.id, action: "GOAL_CREATED", entity: "Goal", entityId: g2.id },
      { actorId: manager1.id, action: "GOAL_APPROVED", entity: "Goal", entityId: g1.id },
      { actorId: manager1.id, action: "GOAL_APPROVED", entity: "Goal", entityId: g2.id },
      { actorId: admin.id, action: "CYCLE_ACTIVATED", entity: "GoalCycle", entityId: cycle.id },
      { actorId: emp1.id, action: "ACHIEVEMENT_UPDATED", entity: "Achievement", entityId: g1.id, newValue: JSON.stringify({ actual: 18, quarter: "Q1" }) },
    ],
  });

  // Progress Scores
  await prisma.progressScore.createMany({
    data: [
      { goalId: g1.id, quarter: "Q1", score: 36, weightedScore: 10.8 },
      { goalId: g1.id, quarter: "Q2", score: 70, weightedScore: 21 },
      { goalId: g2.id, quarter: "Q1", score: 40, weightedScore: 10 },
      { goalId: g3.id, quarter: "Q1", score: 25, weightedScore: 5 },
      { goalId: g4.id, quarter: "Q1", score: 40, weightedScore: 10 },
    ],
  });

  console.log("✅ Seed complete!");
  console.log("\n📋 Demo accounts:");
  console.log("  Employee: priya.sharma@atomgoal.com");
  console.log("  Manager:  rajesh.kumar@atomgoal.com");
  console.log("  Admin:    anita.desai@atomgoal.com");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
