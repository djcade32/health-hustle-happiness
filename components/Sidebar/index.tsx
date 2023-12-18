"use client";

import React from "react";
import { LuBrain } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { IoFitnessOutline } from "react-icons/io5";
import { GoInfinity } from "react-icons/go";
import SidebarTab from "./SidebarTab";

const iconProps = {
  size: 20,
};

const categories = [
  { name: "All", icon: <GoInfinity {...iconProps} /> },
  { name: "Physical Fitness", icon: <IoFitnessOutline {...iconProps} /> },
  { name: "Personal Finance", icon: <GrMoney {...iconProps} /> },
  { name: "Mental Health", icon: <LuBrain {...iconProps} /> },
];

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-[250px] border-r-[.5px] border-gray fixed left-0 h-full bg-primary pt-8">
      <div className="pl-2 mb-1">
        <p className=" text-gray">Categories</p>
      </div>
      <ul className="flex flex-col ">
        {categories.map(({ name, icon }) => (
          <SidebarTab key={name} title={name} icon={icon} />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
