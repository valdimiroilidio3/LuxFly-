import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/actions";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminNav logout={logoutAction} />
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 md:py-12">{children}</main>
    </div>
  );
}
