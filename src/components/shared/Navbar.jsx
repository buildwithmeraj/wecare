import React from "react";
import Logo from "../utilities/Logo";
import Link from "next/link";
import ThemeSwitcher from "../utilities/ThemeSwitcher";

const Navbar = () => {
  return (
    <div className="flex items-center gap-2 justify-between py-2 px-[2%] bg-base-200">
      <Logo />
      <div className="flex items-center gap-2">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/blog">Blog</Link>
      </div>
      <ThemeSwitcher />
    </div>
  );
};

export default Navbar;
