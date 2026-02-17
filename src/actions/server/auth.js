"use server";
// connect to database
import { dbConnect } from "@/lib/dbConnect";

// register user
export const registerUser = async (user) => {
  const { nid, name, email, contact, password, photo } = user;

  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedNid = nid?.trim();
  const normalizedContact = contact?.trim();

  if (
    !normalizedNid ||
    !name?.trim() ||
    !normalizedEmail ||
    !normalizedContact ||
    !password
  ) {
    return { success: false, message: "All required fields must be provided" };
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if (!strongPasswordRegex.test(password)) {
    return {
      success: false,
      message:
        "Password must be at least 6 characters and include upper and lower case letters",
    };
  }

  // check if user already exists
  const isExists = await dbConnect("users").findOne({ email: normalizedEmail });
  if (isExists) {
    return { success: false, message: "User already exists" };
  }

  const duplicateNid = await dbConnect("users").findOne({ nid: normalizedNid });
  if (duplicateNid) {
    return { success: false, message: "NID already used by another account" };
  }

  // encrypt password
  const bcrypt = require("bcryptjs");
  const passwordHash = await bcrypt.hash(password, 10);
  // store user in database
  const newUser = {
    nid: normalizedNid,
    name: name.trim(),
    email: normalizedEmail,
    contact: normalizedContact,
    password: passwordHash,
    photo,
    role: "user",
    authProvider: "credentials",
    createdAt: new Date().toISOString(),
  };
  const result = await dbConnect("users").insertOne(newUser);
  if (!result.acknowledged) {
    return { success: false, message: "User registration failed" };
  }
  return { success: true };
};
