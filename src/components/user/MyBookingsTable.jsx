"use client";

import { cancelBooking } from "@/actions/server/MyBookings";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const statusClassMap = {
  Pending: "badge badge-warning",
  Confirmed: "badge badge-info",
  Completed: "badge badge-success",
  Cancelled: "badge badge-error",
};

export default function MyBookingsTable({ initialBookings, userEmail }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState("");

  const handleCancel = async (bookingId) => {
    setLoadingId(bookingId);
    const result = await cancelBooking(bookingId, userEmail);
    if (result.success) {
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "Cancelled" } : booking
        )
      );
      toast.success("Booking cancelled");
    } else {
      toast.error(result.message || "Cancel failed");
    }
    setLoadingId("");
  };

  if (!bookings.length) {
    return <p className="text-center">You have no bookings yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.serviceName}</td>
              <td>
                {booking.serviceDuration}{" "}
                {booking.serviceType === "perHour" ? "hour(s)" : "day(s)"}
              </td>
              <td>
                {booking.location?.region}, {booking.location?.district},{" "}
                {booking.location?.city}, {booking.location?.area}
              </td>
              <td>৳{booking.totalCost}</td>
              <td>
                <span className={statusClassMap[booking.status] || "badge"}>
                  {booking.status}
                </span>
              </td>
              <td className="flex gap-2">
                <Link
                  href={`/my-bookings/${booking._id}`}
                  className="btn btn-xs btn-outline"
                >
                  View Details
                </Link>
                <button
                  className="btn btn-xs btn-error"
                  disabled={
                    loadingId === booking._id ||
                    !["Pending", "Confirmed"].includes(booking.status)
                  }
                  onClick={() => handleCancel(booking._id)}
                >
                  {loadingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
