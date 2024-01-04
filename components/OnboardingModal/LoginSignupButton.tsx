"use client";

import React, { useState } from "react";
import OnboardingModal from "@/components/OnboardingModal";
import { useAppContext } from "@/context/AppContext";

const LoginSignupButton = () => {
  const { showOnboardingModal, setShowOnboardingModal } = useAppContext();

  return (
    <>
      <div
        onClick={() => setShowOnboardingModal(true)}
        className="border-[1px] bg-[#ffff] text-primary rounded-lg font-medium py-2 px-2 cursor-pointer hover:opacity-75 transition-opacity duration-300"
      >
        <p>Log in | Sign up</p>
      </div>
      <OnboardingModal isOpen={showOnboardingModal} setIsOpen={setShowOnboardingModal} />
    </>
  );
};

export default LoginSignupButton;
