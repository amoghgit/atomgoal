import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { department: true },
        });

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar || undefined,
          departmentId: user.departmentId || undefined,
          departmentName: user.department?.name || undefined,
          managerId: user.managerId || undefined,
          designation: user.designation || undefined,
          employeeCode: user.employeeCode || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.departmentId = (user as any).departmentId;
        token.departmentName = (user as any).departmentName;
        token.managerId = (user as any).managerId;
        token.designation = (user as any).designation;
        token.employeeCode = (user as any).employeeCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).departmentId = token.departmentId;
        (session.user as any).departmentName = token.departmentName;
        (session.user as any).managerId = token.managerId;
        (session.user as any).designation = token.designation;
        (session.user as any).employeeCode = token.employeeCode;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "atomgoal-demo-secret-key-2024",
});
