"use client";

import React from "react";
import Feed from "./Feed";
import { useAppContext } from "@/context/AppContext";

const Content = () => {
  const { showProfileScreen } = useAppContext();
  return (
    <div className="">
      <Feed />
    </div>
  );
};

export default Content;
