"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";

// add service
export const AddService = async (data) => {
  const {
    name,
    image,
    category,
    description,
    pricePerHour,
    pricePerDay,
    features,
  } = data;

  // check if service already exists
  const isExists = await dbConnect("services").findOne({ name: name });
  if (isExists) {
    return { success: false, message: "Service already exists" };
  }

  // store service in database
  const newService = {
    name,
    image,
    category,
    description,
    pricePerHour,
    pricePerDay,
    features,
    createdAt: new Date().toISOString(),
  };
  const result = await dbConnect("services").insertOne(newService);
  if (!result.acknowledged) {
    return { success: false, message: "Service registration failed" };
  }
  return { success: true };
};
