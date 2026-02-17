"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSearchParamsSafe } from "@/hooks/useSearchParamsSafe";
import { ImGoogle } from "react-icons/im";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa6";
import { registerUser } from "@/actions/server/auth";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParamsSafe();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nid: "",
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    photo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidImageUrl = (url) => {
    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|avif|svg))$/i.test(url);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.error(
        "Password must be 6+ chars with at least one uppercase and one lowercase letter",
      );
      return;
    }

    if (formData.photo && !isValidImageUrl(formData.photo)) {
      toast.error("Please provide a valid image URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      if (!response?.success) {
        throw new Error(response?.message || "Registration failed");
      }

      toast.success("Account created! Logging you in...");

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed. Please try logging in manually.");
        router.push("/login");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Failed to sign up with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="hero min-h-[75vh]">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>

            <div className="space-y-4">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">NID No</span>
                </label>
                <input
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleInputChange}
                  placeholder="NID number"
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>

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
                  <span className="label-text">Contact Number</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="+8801XXXXXXXXX"
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
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="label-text">
                    Profile Photo URL (optional)
                  </span>
                </label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered w-full"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={
                  isLoading ||
                  !formData.nid ||
                  !formData.name ||
                  !formData.email ||
                  !formData.contact ||
                  !formData.password
                }
                className="btn btn-primary w-full flex items-center gap-2"
              >
                <FaUserPlus className="text-lg mb-0.5" />
                {isLoading ? (
                  <span>
                    <span className="loading loading-spinner"></span> Creating
                    Account
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="divider">OR</div>

            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="btn bg-white text-black border-[#e5e5e5] hover:bg-gray-50 w-full"
            >
              <ImGoogle className="text-xl mr-2" />
              Sign up with Google
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="link link-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
