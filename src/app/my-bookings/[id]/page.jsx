import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBookingById } from "@/actions/server/MyBookings";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default async function BookingDetailsPage({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const statusClassMap = {
    Pending: "text-warning",
    Confirmed: "text-info",
    Completed: "text-success",
    Cancelled: "text-error",
  };

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/my-bookings/${id}`)}`);
  }

  const booking = await getBookingById(id, session.user.email);

  if (!booking) {
    return <p className="text-center">Booking not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto card bg-base-100 shadow-sm">
      <div className="card-body space-y-2">
        <h1 className="text-xl font-semibold">Booking Details</h1>
        <p>
          <span className="font-semibold">Service:</span> {booking.serviceName}
        </p>
        <p>
          <span className="font-semibold">Duration:</span>{" "}
          {booking.serviceDuration}{" "}
          {booking.serviceType === "perHour" ? "hour(s)" : "day(s)"}
        </p>
        <p>
          <span className="font-semibold">Rate:</span> ৳{booking.pricePerUnit}
        </p>
        <p>
          <span className="font-semibold">Total Cost:</span> ৳
          {booking.totalCost}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span className={statusClassMap[booking.status] || "text-gray-500"}>
            {booking.status}
          </span>
        </p>
        <p>
          <span className="font-semibold">Location:</span>{" "}
          {booking.location?.region}, {booking.location?.district},{" "}
          {booking.location?.city}, {booking.location?.area}
        </p>
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {booking.location?.address}
        </p>
        <p>
          <span className="font-semibold">Booked At:</span>{" "}
          {new Date(booking.createdAt).toLocaleString()}
        </p>
        <div className="text-center">
          <Link href="/my-bookings" className="btn btn-soft w-fit mt-3">
            <IoMdArrowRoundBack className="mt-0.5" />
            Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
