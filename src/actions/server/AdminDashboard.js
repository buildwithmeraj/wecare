"use server";

import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

export const getAdminDashboardData = async () => {
  const [services, bookings] = await Promise.all([
    dbConnect("services").find({}).sort({ createdAt: -1 }).toArray(),
    dbConnect("bookings").find({}).sort({ createdAt: -1 }).toArray(),
  ]);

  const normalizedServices = services.map((service) => ({
    ...service,
    _id: service._id.toString(),
  }));

  const normalizedBookings = bookings.map((booking) => ({
    ...booking,
    _id: booking._id.toString(),
  }));

  const stats = {
    totalServices: normalizedServices.length,
    totalBookings: normalizedBookings.length,
    pendingBookings: normalizedBookings.filter(
      (booking) => booking.status === "Pending"
    ).length,
    totalRevenue: normalizedBookings
      .filter((booking) => booking.status === "Completed")
      .reduce((sum, booking) => sum + Number(booking.totalCost || 0), 0),
  };

  return {
    services: normalizedServices,
    bookings: normalizedBookings,
    stats,
  };
};

export const updateBookingStatusByAdmin = async (bookingId, nextStatus) => {
  if (!ObjectId.isValid(bookingId)) {
    return { success: false, message: "Invalid booking id" };
  }

  if (!allowedStatuses.includes(nextStatus)) {
    return { success: false, message: "Invalid status" };
  }

  const result = await dbConnect("bookings").updateOne(
    { _id: new ObjectId(bookingId) },
    {
      $set: {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  if (result.modifiedCount === 0) {
    return { success: false, message: "No changes were made" };
  }

  return { success: true };
};
