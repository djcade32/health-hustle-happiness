"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useEffect } from "react";

interface Props {
  title: string;
  icon: React.ReactNode;
}

const SidebarTab = ({ title, icon }: Props) => {
  const { selectedTab, setSelectedTab } = useAppContext();

  return (
    <li
      onClick={() => {
        setSelectedTab(title);
      }}
      className={`flex items-center gap-2 cursor-pointer pl-2 py-2 text-[#D3E3FD] hover:bg-primary-light hover:text-white ${
        selectedTab === title ? "bg-primary-light text-white" : ""
      }`}
    >
      <div>{icon}</div>
      <p>{title}</p>
    </li>
  );
};

export default SidebarTab;
