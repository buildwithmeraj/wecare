"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParamsSafe } from "@/hooks/useSearchParamsSafe";
import { ImGoogle } from "react-icons/im";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

export default function LoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParamsSafe();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful!");
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to login with Google");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="hero min-h-[82vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="hero min-h-[82vh]">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <h1 className="text-4xl font-bold text-center mb-6">Login</h1>

            <div className="space-y-4">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
                <label className="label">
                  <Link
                    href="/forgot-password"
                    className="label-text-alt link link-hover mt-2"
                  >
                    Forgot password?
                  </Link>
                </label>
              </div>

              <button
                onClick={handleCredentialsLogin}
                disabled={isLoading || !formData.email || !formData.password}
                className="btn btn-primary w-full"
              >
                <FaSignInAlt />
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="divider">OR</div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="btn bg-white text-black border-[#e5e5e5] hover:bg-gray-50 w-full"
            >
              <ImGoogle className="text-xl" />
              Continue with Google
            </button>

            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="link link-primary font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
