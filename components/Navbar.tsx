"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/public/assets/logo.png";
import Link from "next/link";
import LoginSignupButton from "./OnboardingModal/LoginSignupButton";
import { useAppContext } from "@/context/AppContext";
import UserAvatar from "./UserAvatar";
import { IoMenuOutline } from "react-icons/io5";
import AnimatedText from "./AnimatedText";

const Navbar = () => {
  const { user, setIsSidebarOpen } = useAppContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="px-3 py-5 border-b-[.5px] max-[1020px]:justify-center border-gray sticky top-0 left-0 w-full bg-primary z-[5] font-thin flex items-center justify-between">
      <div
        className="max-[1020px]:absolute max-[1020px]:block max-[1020px]:left-5 cursor-pointer hover:bg-gray rounded-lg p-2 hidden"
        onClick={() => setIsSidebarOpen((prev: boolean) => !prev)}
      >
        <IoMenuOutline size={30} />
      </div>
      <Link
        href="/"
        className="flex gap-2 max-w-fit max-[670px]:gap-1"
        scroll={false}
        onClick={scrollToTop}
      >
        <Image src={logo} width={50} height={50} alt="health hustle happiness logo" />
        <p className="self-center subtitle-text text-[#D3E3FD] max-[670px]:text-[18px] max-[670px]:hidden">
          <span className="font-bold text-white">H</span>
          <AnimatedText word="ealth" />
          <span className="font-bold text-white">H</span>
          <AnimatedText word="ustle" />
          <span className="font-bold text-white">H</span>
          <AnimatedText word="appiness" />
        </p>
      </Link>
      <div className="max-[1020px]:hidden">
        {user ? <UserAvatar user={user} /> : <LoginSignupButton />}
      </div>
    </header>
  );
};

export default Navbar;
