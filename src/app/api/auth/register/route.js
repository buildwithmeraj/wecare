import { NextResponse } from "next/server";
import { registerUser } from "@/actions/server/auth";

export async function POST(req) {
  try {
    const payload = await req.json();
    const result = await registerUser(payload);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
