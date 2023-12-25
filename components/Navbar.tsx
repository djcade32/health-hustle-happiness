"use client";

import Image from "next/image";
import React, { useState } from "react";
import logo from "@/public/assets/logo.png";
import Link from "next/link";
import OnboardingModal from "./OboardingModal";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="px-3 py-5 border-b-[.5px] border-gray sticky top-0 left-0 w-full bg-primary z-[5] font-thin flex items-center justify-between">
      <Link href="/" className="flex gap-3 max-w-fit">
        <Image src={logo} width={50} height={50} alt="health hustle happiness logo" />
        <p className="self-center subtitle-text text-[#D3E3FD]">Health Hustle Happiness</p>
      </Link>
      <div
        onClick={() => setOpen(true)}
        className="border-[1px] bg-[#ffff] text-primary rounded-lg font-medium py-2 px-2 cursor-pointer hover:opacity-75 transition-opacity duration-300"
      >
        <p>Log in | Sign up</p>
      </div>
      <OnboardingModal isOpen={open} setIsOpen={setOpen} />
    </header>
  );
};

export default Navbar;
