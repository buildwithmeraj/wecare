"use server";

import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const getMyBookings = async (email) => {
  if (!email) return [];

  const bookings = await dbConnect("bookings")
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
    .toArray();

  return bookings.map((booking) => ({
    ...booking,
    _id: booking._id.toString(),
  }));
};

export const getBookingById = async (bookingId, userEmail) => {
  if (!ObjectId.isValid(bookingId)) {
    return null;
  }

  const booking = await dbConnect("bookings").findOne({
    _id: new ObjectId(bookingId),
    userEmail,
  });

  if (!booking) return null;

  return {
    ...booking,
    _id: booking._id.toString(),
  };
};

export const cancelBooking = async (bookingId, userEmail) => {
  if (!ObjectId.isValid(bookingId)) {
    return { success: false, message: "Invalid booking id" };
  }

  const result = await dbConnect("bookings").updateOne(
    {
      _id: new ObjectId(bookingId),
      userEmail,
      status: { $in: ["Pending", "Confirmed"] },
    },
    {
      $set: {
        status: "Cancelled",
        cancelledAt: new Date().toISOString(),
      },
    }
  );

  if (result.modifiedCount === 0) {
    return { success: false, message: "Booking cannot be cancelled" };
  }

  return { success: true };
};
