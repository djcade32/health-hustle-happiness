"use client";

import Image from "next/image";
import React from "react";
import logo from "@/public/assets/logo.png";
import Link from "next/link";
import LoginSignupButton from "./OnboardingModal/LoginSignupButton";
import { useAppContext } from "@/context/AppContext";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { user } = useAppContext();

  return (
    <header className="px-3 py-5 border-b-[.5px] border-gray sticky top-0 left-0 w-full bg-primary z-[5] font-thin flex items-center justify-between">
      <Link href="/" className="flex gap-3 max-w-fit">
        <Image src={logo} width={50} height={50} alt="health hustle happiness logo" />
        <p className="self-center subtitle-text text-[#D3E3FD]">Health Hustle Happiness</p>
      </Link>

      {user ? <UserAvatar user={user} /> : <LoginSignupButton />}
    </header>
  );
};

export default Navbar;
