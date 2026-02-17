"use client";
import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="hero min-h-[75vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
