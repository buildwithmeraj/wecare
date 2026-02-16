"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";

// register user
export const registerUser = async (user) => {
  const { name, email, password, photo } = user;

  // check if user already exists
  const isExists = await dbConnect("users").findOne({ email: email });
  if (isExists) {
    return { success: false, message: "User already exists" };
  }
  // encrypt password
  const bcrypt = require("bcryptjs");
  const passwordHash = await bcrypt.hash(password, 10);
  // store user in database
  const newUser = {
    name,
    email,
    password: passwordHash,
    photo,
    role: "user",
    createdAt: new Date().toISOString(),
  };
  const result = await dbConnect("users").insertOne(newUser);
  if (!result.acknowledged) {
    return { success: false, message: "User registration failed" };
  }
  return { success: true };
};
