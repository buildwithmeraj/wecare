"use client";
import Link from "next/link";
import { PiListHeartFill } from "react-icons/pi";
import { FaArrowLeft, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Image from "next/image";
import LogoutButton from "./auth/LogoutButton";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col items-center gap-8 p-6 min-h-screen pt-20">
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center gap-4 mb-8 pb-6 border-b border-base-300">
          {user?.image && (
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2">
                <Image
                  alt={user?.name || "User avatar"}
                  src={user.image}
                  width={96}
                  height={96}
                />
              </div>
            </div>
          )}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
            <p className="text-base-content/70">{user?.email}</p>
            {isAdmin && <div className="badge badge-primary mt-2">Admin</div>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Link href="/my-bookings" className="btn btn-outline btn-primary">
            <PiListHeartFill className="text-lg" />
            My Bookings
          </Link>
          <button onClick={() => signOut()} className="btn btn-error">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
        {isAdmin && (
          <div className="flex justify-center">
            <Link
              href="/admin"
              className="btn btn-outline btn-secondary mt-4"
            >
              <FaTachometerAlt className="text-lg" />
              Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
