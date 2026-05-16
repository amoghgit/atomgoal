// Type extensions for NextAuth
import { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: Role;
      departmentId?: string;
      departmentName?: string;
      managerId?: string;
      designation?: string;
      employeeCode?: string;
    };
  }

  interface User {
    role: Role;
    departmentId?: string;
    departmentName?: string;
    managerId?: string;
    designation?: string;
    employeeCode?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    departmentId?: string;
    departmentName?: string;
    managerId?: string;
    designation?: string;
    employeeCode?: string;
  }
}
