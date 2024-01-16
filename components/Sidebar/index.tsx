"use client";

import React, { useEffect } from "react";
import { IoFitnessOutline } from "react-icons/io5";
import { GoInfinity } from "react-icons/go";
import SidebarTab from "./SidebarTab";
import { MdLogout, MdOutlineFeedback } from "react-icons/md";
import { useAppContext } from "@/context/AppContext";
import { PiBookmarkSimple, PiMoneyLight, PiBrainLight, PiHandHeart } from "react-icons/pi";
import { AiOutlineFire } from "react-icons/ai";
import { IoHeartOutline, IoEyeOutline, IoInformationCircleOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { Drawer } from "antd";
import UserAvatar from "../UserAvatar";
import LoginSignupButton from "../OnboardingModal/LoginSignupButton";
import Link from "next/link";

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
  const {
    setSelectedTab,
    signUserOut,
    user,
    isSidebarOpen,
    setIsSidebarOpen,
    setShowAboutUsModal,
    setShowProfileScreen,
  } = useAppContext();

  const handleFeedbackClick = () => {
    window.open("https://forms.gle/YRVqQKpNqBzZky9H8", "_blank");
  };

  const handleSupportCreatorClick = () => {
    window.open("https://bmc.link/normancade", "_blank");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1020) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  return (
    // TODO: Add invite friends tab
    // TODO: Change button highlight to profile tab when chosen
    <div>
      <Drawer
        closable={false}
        onClose={() => setIsSidebarOpen(false)}
        open={isSidebarOpen}
        placement="left"
        key={"left"}
        width={250}
        styles={{
          body: { backgroundColor: "#021525", borderRight: ".5px solid #96A7BF", padding: 0 },
          mask: { backgroundColor: "rgb(211, 227, 253, 0.4)" },
        }}
      >
        <div className="h-full flex flex-col py-5">
          <div className="mb-2 h-[45px]">
            {user ? (
              <div className="pl-3 ">
                <UserAvatar user={user} />
              </div>
            ) : (
              <div className="flex justify-center">
                <LoginSignupButton />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
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

            <div>
              <ul className="flex flex-col ">
                <SidebarTab
                  key={"feedback"}
                  title="Feedback"
                  icon={<MdOutlineFeedback {...iconProps} />}
                  onClick={handleFeedbackClick}
                />
                <SidebarTab
                  key={"support_creator"}
                  title="Support Creator"
                  icon={<PiHandHeart {...iconProps} />}
                  onClick={handleSupportCreatorClick}
                />
                <SidebarTab
                  key={"about_us"}
                  title="About Us"
                  icon={<IoInformationCircleOutline {...iconProps} />}
                  onClick={() => setShowAboutUsModal(true)}
                />
              </ul>
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
            </div>
          </div>
        </div>
      </Drawer>

      <aside className="flex flex-col w-[250px] border-r-[.5px] border-gray fixed left-0 h-full bg-primary pt-8 justify-between pb-[90px] max-[1020px]:hidden">
        <div>
          <div className="pl-2 mb-1">
            <p className=" text-gray">Categories</p>
          </div>
          <ul className="flex flex-col ">
            {categories.map(({ name, icon }) => (
              <Link href={"/"} key={name}>
                <SidebarTab
                  key={name}
                  title={name}
                  icon={icon}
                  onClick={() => {
                    setSelectedTab(name);
                  }}
                />
              </Link>
            ))}
          </ul>

          <div className="pl-2 mb-1 mt-6">
            <p className=" text-gray">Discover</p>
          </div>
          <ul className="flex flex-col ">
            <Link href={"/"}>
              <SidebarTab
                key={"popular"}
                title="Popular"
                icon={<AiOutlineFire {...iconProps} />}
                onClick={() => {
                  setSelectedTab("Popular");
                }}
              />
            </Link>
            <Link href={"/"}>
              <SidebarTab
                key={"most_liked"}
                title="Most Liked"
                icon={<IoHeartOutline {...iconProps} />}
                onClick={() => {
                  setSelectedTab("Most Liked");
                }}
              />
            </Link>
          </ul>
          {user && (
            <>
              <div className="pl-2 mb-1 mt-6">
                <p className=" text-gray">Manage</p>
              </div>
              <ul className="flex flex-col ">
                <Link href={"/"}>
                  <SidebarTab
                    key={"bookmarks"}
                    title="Bookmarks"
                    icon={<PiBookmarkSimple {...iconProps} />}
                    onClick={() => {
                      setSelectedTab("Bookmarks");
                    }}
                  />
                </Link>
                <Link href={"/"}>
                  <SidebarTab
                    key={"recently_viewed"}
                    title="Recently Viewed"
                    icon={<IoEyeOutline {...iconProps} />}
                    onClick={() => {
                      setSelectedTab("Recently Viewed");
                    }}
                  />
                </Link>
              </ul>
            </>
          )}
        </div>

        <div>
          <ul className="flex flex-col ">
            <SidebarTab
              key={"feedback"}
              title="Feedback"
              icon={<MdOutlineFeedback {...iconProps} />}
              onClick={handleFeedbackClick}
            />
            <SidebarTab
              key={"support_creator"}
              title="Support Creator"
              icon={<PiHandHeart {...iconProps} />}
              onClick={handleSupportCreatorClick}
            />
            <SidebarTab
              key={"about_us"}
              title="About Us"
              icon={<IoInformationCircleOutline {...iconProps} />}
              onClick={() => setShowAboutUsModal(true)}
            />
          </ul>
          {user && (
            <div>
              <Link href={"/profile"}>
                <SidebarTab
                  key={"profile"}
                  title="Profile"
                  icon={<HiOutlineUser {...iconProps} />}
                  onClick={() => setSelectedTab("Profile")}
                  showSelected={false}
                />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
