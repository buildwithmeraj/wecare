"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";

// list services
export const ServicesList = async () => {
  const services = await dbConnect("services").find({}).toArray();
  return services.map((service) => ({
    ...service,
    _id: service._id.toString(),
    createdAt: service.createdAt?.toString(),
  }));
};
