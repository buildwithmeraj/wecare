"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// delete service
export const DeleteService = async (id) => {
  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid service ID" };
  }

  const serviceId = new ObjectId(id);

  // check if service exists
  const isExists = await dbConnect("services").findOne({ _id: serviceId });

  if (!isExists) {
    return { success: false, message: "Service not found" };
  }

  // delete service
  const result = await dbConnect("services").deleteOne({ _id: serviceId });
  if (result.deletedCount === 0) {
    return { success: false, message: "No changes were made" };
  }
  return { success: true };
};
