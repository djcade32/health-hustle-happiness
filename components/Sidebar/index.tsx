"use client";

import React from "react";
import { LuBrain } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { IoFitnessOutline } from "react-icons/io5";
import { GoInfinity } from "react-icons/go";
import SidebarTab from "./SidebarTab";
import { MdLogout } from "react-icons/md";
import { useAppContext } from "@/context/AppContext";

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
  const { selectedTab, setSelectedTab, signUserOut, user } = useAppContext();

  return (
    <aside className="flex flex-col w-[250px] border-r-[.5px] border-gray fixed left-0 h-full bg-primary pt-8 justify-between pb-[90px]">
      <div>
        <div className="pl-2 mb-1">
          <p className=" text-gray">Categories</p>
        </div>
        <ul className="flex flex-col ">
          {categories.map(({ name, icon }) => (
            <SidebarTab
              key={name}
              title={name}
              icon={icon}
              onClick={() => {
                setSelectedTab(name);
              }}
            />
          ))}
        </ul>
      </div>
      {user && (
        <div>
          <SidebarTab
            key={"sign_out"}
            title="Sign out"
            icon={<MdLogout {...iconProps} />}
            onClick={signUserOut}
            showSelected={false}
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
