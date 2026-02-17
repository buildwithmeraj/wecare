"use client";
import React from "react";
import Logo from "../utilities/Logo";
import Link from "next/link";
import ThemeSwitcher from "../utilities/ThemeSwitcher";
import { useSession } from "next-auth/react";
import logout from "@/actions/client/Logout";
import Image from "next/image";
import { FaSignOutAlt, FaUserAlt, FaTachometerAlt } from "react-icons/fa";

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="grid md:grid-cols-3 justify-between gap-2 py-2 px-[2%] bg-base-200 fixed top-0 left-0 right-0 z-50">
      <Link href="/">
        <Logo />
      </Link>
      <div className="hidden md:flex place-self-center justify-center items-center text-center gap-3">
        <Link href="/" className="hover:text-primary hover:font-semibold">
          Home
        </Link>
        <Link
          href="/services"
          className="hover:text-primary hover:font-semibold"
        >
          Services
        </Link>
        {session?.user && (
          <Link
            href="/my-bookings"
            className="hover:text-primary hover:font-semibold"
          >
            My Bookings
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/admin"
            className="hover:text-primary hover:font-semibold"
          >
            Dashboard
          </Link>
        )}
      </div>
      <div className="hidden md:flex place-self-end items-center gap-1">
        {session ? (
          <>
            <div className="dropdown dropdown-center">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    alt="Tailwind CSS Navbar component"
                    src={session.user?.image}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-36 p-2 shadow"
              >
                {isAdmin && (
                  <li>
                    <Link href="/admin">
                      <FaTachometerAlt />
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/profile">
                    <FaUserAlt />
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-error"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/login" className="mr-4">
            Login
          </Link>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Navbar;
