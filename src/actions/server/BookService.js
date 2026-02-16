"use server";
import { dbConnect } from "@/lib/dbConnect";

export const BookService = async (data) => {
  const {
    userEmail,
    serviceId,
    serviceName,
    serviceType,
    serviceDuration,
    pricePerUnit,
    totalCost,
    status,
    location,
  } = data;

  const newBooking = {
    userEmail,
    serviceId,
    serviceName,
    serviceType,
    serviceDuration,
    pricePerUnit,
    totalCost,
    status,
    location,
    createdAt: new Date().toISOString(),
  };

  const result = await dbConnect("bookings").insertOne(newBooking);

  if (!result.acknowledged) {
    return { success: false, message: "Booking failed" };
  }

  return { success: true };
};
