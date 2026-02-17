import Dashboard from "@/components/admin/Dashboard";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Care.xyz",
  description: "Manage services and bookings from the Care.xyz admin panel.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    session.user.role === "admin" ||
    adminEmails.includes(session.user.email.toLowerCase());

  if (!isAdmin) {
    redirect("/");
  }

  return <Dashboard />;
}
