"use client";

import React from "react";
import { IoFitnessOutline } from "react-icons/io5";
import { GoInfinity } from "react-icons/go";
import SidebarTab from "./SidebarTab";
import { MdLogout } from "react-icons/md";
import { useAppContext } from "@/context/AppContext";
import { PiBookmarkSimple, PiMoneyLight, PiBrainLight } from "react-icons/pi";
import { AiOutlineFire } from "react-icons/ai";
import { IoHeartOutline, IoEyeOutline } from "react-icons/io5";

const iconProps = {
  size: 20,
};

const categories = [
  { name: "All", icon: <GoInfinity {...iconProps} /> },
  { name: "Physical Fitness", icon: <IoFitnessOutline {...iconProps} /> },
  { name: "Personal Finance", icon: <PiMoneyLight {...iconProps} /> },
  { name: "Mental Health", icon: <PiBrainLight {...iconProps} /> },
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

        <div className="pl-2 mb-1 mt-6">
          <p className=" text-gray">Discover</p>
        </div>
        <ul className="flex flex-col ">
          <SidebarTab
            key={"popular"}
            title="Popular"
            icon={<AiOutlineFire {...iconProps} />}
            onClick={() => {
              setSelectedTab("Popular");
            }}
          />
          <SidebarTab
            key={"most_liked"}
            title="Most Liked"
            icon={<IoHeartOutline {...iconProps} />}
            onClick={() => {
              setSelectedTab("Most Liked");
            }}
          />
        </ul>
        {user && (
          <>
            <div className="pl-2 mb-1 mt-6">
              <p className=" text-gray">Manage</p>
            </div>
            <ul className="flex flex-col ">
              <SidebarTab
                key={"bookmarks"}
                title="Bookmarks"
                icon={<PiBookmarkSimple {...iconProps} />}
                onClick={() => {
                  setSelectedTab("Bookmarks");
                }}
              />
              <SidebarTab
                key={"recently_viewed"}
                title="Recently Viewed"
                icon={<IoEyeOutline {...iconProps} />}
                onClick={() => {
                  setSelectedTab("Recently Viewed");
                }}
              />
            </ul>
          </>
        )}
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
