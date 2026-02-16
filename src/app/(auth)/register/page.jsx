"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ImGoogle } from "react-icons/im";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa6";
import { registerUser } from "@/actions/server/auth";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate image URL
  const isValidImageUrl = (url) => {
    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|avif|svg))$/i.test(url);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
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

      // Auto login after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed. Please try logging in manually.");
        router.push("/login");
      } else {
        router.push("/profile");
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
      await signIn("google", { callbackUrl: "/profile" });
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
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.email ||
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
              <Link href="/login" className="link link-primary font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
