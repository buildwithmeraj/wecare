import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getMyBookings } from "@/actions/server/MyBookings";
import MyBookingsTable from "@/components/user/MyBookingsTable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Bookings | Care.xyz",
  description: "Track your caregiving bookings and statuses.",
};

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/my-bookings");
  }

  const bookings = await getMyBookings(session.user.email);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <MyBookingsTable initialBookings={bookings} userEmail={session.user.email} />
    </div>
  );
}
