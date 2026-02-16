"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// fetch a service
export const ServiceDetails = async (id) => {
  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid service ID" };
  }

  const serviceId = new ObjectId(id);

  // check if service exists
  const service = await dbConnect("services").findOne({ _id: serviceId });

  if (!service) {
    return { success: false, message: "Service not found" };
  }

  return {
    ...service,
    _id: service._id.toString(),
    createdAt: service.createdAt?.toString(),
  };
};
