"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";

// list services
export const ServicesList = async (limit = 0) => {
  const query = {};
  if (limit) {
    query.limit = parseInt(limit, 10);
  }
  const services = await dbConnect("services").find(query).toArray();
  return services.map((service) => ({
    ...service,
    _id: service._id.toString(),
    createdAt: service.createdAt?.toString(),
  }));
};
