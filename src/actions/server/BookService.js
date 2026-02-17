"use server";
import { dbConnect } from "@/lib/dbConnect";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";

export const BookService = async (data) => {
  const {
    userEmail,
    serviceId,
    serviceName,
    serviceType,
    serviceDuration,
    pricePerUnit,
    location,
  } = data;

  if (!userEmail || !serviceId || !serviceName || !serviceType || !location) {
    return { success: false, message: "Required booking information is missing" };
  }
  if (
    !location.region ||
    !location.district ||
    !location.city ||
    !location.area ||
    !location.address
  ) {
    return { success: false, message: "Complete location details are required" };
  }

  const duration = Number(serviceDuration);
  const unitPrice = Number(pricePerUnit);
  const computedTotal = duration * unitPrice;

  if (!duration || duration < 1 || !unitPrice || unitPrice < 1) {
    return { success: false, message: "Invalid booking duration or price" };
  }

  const user = await dbConnect("users").findOne({ email: userEmail });

  const newBooking = {
    userEmail,
    userName: user?.name || "",
    serviceId,
    serviceName,
    serviceType,
    serviceDuration: duration,
    pricePerUnit: unitPrice,
    totalCost: computedTotal,
    status: "Pending",
    location,
    createdAt: new Date().toISOString(),
  };

  const result = await dbConnect("bookings").insertOne(newBooking);

  if (!result.acknowledged) {
    return { success: false, message: "Booking failed" };
  }

  const emailResult = await sendInvoiceEmail({
    to: userEmail,
    booking: newBooking,
  });

  return {
    success: true,
    emailSuccess: emailResult.success,
  };
};
