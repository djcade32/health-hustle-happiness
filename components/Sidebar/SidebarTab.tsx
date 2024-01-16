"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useEffect } from "react";

interface Props {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  showSelected?: boolean;
  suffixIcon?: React.ReactNode;
  isSelected?: boolean;
}

const SidebarTab = ({
  title,
  icon,
  onClick,
  showSelected = true,
  suffixIcon,
  isSelected,
}: Props) => {
  const { selectedTab } = useAppContext();

  const checkIsSelected = () => {
    if (selectedTab === title || isSelected) {
      return "bg-primary-light text-white";
    }
    // return selectedTab === title && showSelected
    //   ? "bg-primary-light text-white"
    //   : "";
  };

  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer max-[1020px]:pl-3 pl-2 py-2 text-[#D3E3FD] hover:bg-primary-light hover:text-white transition-colors duration-300 ${checkIsSelected()} justify-between`}
    >
      <div className="flex gap-2  items-center ">
        <div>{icon}</div>
        <p>{title}</p>
      </div>

      <div className="pr-2">{suffixIcon}</div>
    </li>
  );
};

export default SidebarTab;
