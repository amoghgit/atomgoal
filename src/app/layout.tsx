import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "AtomGoal – Goal Setting & Tracking Portal",
  description:
    "Enterprise goal setting, tracking and performance management platform for modern organizations.",
  keywords: ["goal tracking", "performance management", "HR tech", "OKR"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50/50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
