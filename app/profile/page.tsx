"use client";

import SidebarTab from "@/components/Sidebar/SidebarTab";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

const Page = () => {
  const { signUserOut } = useAppContext();

  return (
    <div className="flex border-r-[.5px] border-l-[.5px] w-[70%] ">
      <p className="header-text">Profile</p>
      {/* <div className="w-[40%] border-r-[.5px] border-gray pr-2">
          <SidebarTab icon={<AiOutlineProfile size={20} />} onClick={() => {}} title="Account" />
          <SidebarTab
            key={"sign_out"}
            title="Sign out"
            icon={<MdLogout size={20} />}
            onClick={signUserOut}
            showSelected={false}
          />
        </div>
        <div className="flex-1 px-4">
          <p>hello world</p>
        </div> */}
    </div>
  );
};

export default Page;
