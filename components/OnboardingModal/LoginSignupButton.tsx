"use client";

import React, { useState } from "react";
import OnboardingModal from "@/components/OnboardingModal";

const LoginSignupButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="border-[1px] bg-[#ffff] text-primary rounded-lg font-medium py-2 px-2 cursor-pointer hover:opacity-75 transition-opacity duration-300"
      >
        <p>Log in | Sign up</p>
      </div>
      <OnboardingModal isOpen={open} setIsOpen={setOpen} />
    </>
  );
};

export default LoginSignupButton;
