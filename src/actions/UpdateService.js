"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// update service
export const UpdateService = async (data) => {
  const {
    id,
    name,
    image,
    category,
    description,
    pricePerHour,
    pricePerDay,
    features,
  } = data;

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid service ID" };
  }

  const serviceId = new ObjectId(id);

  // check if service exists
  const isExists = await dbConnect("services").findOne({ _id: serviceId });

  if (!isExists) {
    return { success: false, message: "Service not found" };
  }

  // update service
  const result = await dbConnect("services").updateOne(
    { _id: serviceId },
    {
      $set: {
        name,
        image,
        category,
        description,
        pricePerHour: parseFloat(pricePerHour),
        pricePerDay: parseFloat(pricePerDay),
        features: features.split(",").map((feature) => feature.trim()),
      },
    }
  );
  if (result.modifiedCount === 0) {
    return { success: false, message: "No changes were made" };
  }
  return { success: true };
};
