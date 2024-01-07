"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useEffect } from "react";

interface Props {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  showSelected?: boolean;
}

const SidebarTab = ({ title, icon, onClick, showSelected = true }: Props) => {
  const { selectedTab } = useAppContext();

  const checkIsSelected = () => {
    return selectedTab === title && showSelected ? "bg-primary-light text-white" : "";
  };

  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer max-[1020px]:pl-3 pl-2 py-2 text-[#D3E3FD] hover:bg-primary-light hover:text-white transition-colors duration-300 ${checkIsSelected()}`}
    >
      <div>{icon}</div>
      <p>{title}</p>
    </li>
  );
};

export default SidebarTab;
