"use client";

import { useAppContext } from "@/context/AppContext";
import { Modal } from "antd";
import React from "react";
import SidebarTab from "./Sidebar/SidebarTab";
import { AiOutlineProfile } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

const ProfileScreen = () => {
  const { signUserOut } = useAppContext();

  return (
    <div className="flex ">
      <div className="w-[40%] border-r-[.5px] border-gray pr-2">
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
      </div>
    </div>
  );
};

export default ProfileScreen;
