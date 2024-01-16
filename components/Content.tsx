import React from "react";
import Feed from "./Feed";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import OnboardingModal from "./OnboardingModal";
import AboutUsModal from "./AboutUsModal";

const Content = () => {
  return (
    <main className="flex flex-row flex-1  overflow-hidden ">
      <Sidebar />
      <div
        id="content"
        className="flex flex-1 min-[1020px]:ml-[250px] justify-center overflow-y-auto custom-scrollbar"
      >
        <div className="py-5">
          <Feed />
        </div>
      </div>
    </main>
  );
};

export default Content;
