import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AppNavigation from "@/components/AppNavigation";
import { authOptions } from "@/utils/auth-options";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.user_id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppNavigation />
      {children}
    </div>
  );
}
