import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="hero min-h-[82vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
