"use client";
import React from "react";
import Logo from "../utilities/Logo";
import Link from "next/link";
import ThemeSwitcher from "../utilities/ThemeSwitcher";
import { useSession } from "next-auth/react";
import logout from "@/actions/client/Logout";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center gap-2 justify-between py-2 px-[2%] bg-base-200">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/blog">Blog</Link>
      </div>
      <div>
        {session ? (
          <>
            <span className="mr-4">Welcome, {session.user.name}</span>
            <button
              className="btn btn-outline btn-secondary"
              onClick={() => logout()}
            >
              Logout
            </button>
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
