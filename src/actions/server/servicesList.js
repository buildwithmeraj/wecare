"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";

// list services
export const ServicesList = async (limit = 0) => {
  const numericLimit = Number(limit);
  const cursor = dbConnect("services").find({});
  if (Number.isFinite(numericLimit) && numericLimit > 0) {
    cursor.limit(numericLimit);
  }
  const services = await cursor.toArray();
  return services.map((service) => ({
    ...service,
    _id: service._id.toString(),
    createdAt: service.createdAt?.toString(),
  }));
};
