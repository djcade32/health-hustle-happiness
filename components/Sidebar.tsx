import React from "react";
import { LuBrain } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { IoFitnessOutline } from "react-icons/io5";
import { GoInfinity } from "react-icons/go";

const iconProps = {
  size: 20,
  // color: "#96A7BF",
};

const categories = [
  { name: "All", icon: <GoInfinity {...iconProps} /> },
  { name: "Physical Fitness", icon: <IoFitnessOutline {...iconProps} /> },
  { name: "Personal Finances", icon: <GrMoney {...iconProps} /> },
  { name: "Mental Health", icon: <LuBrain {...iconProps} /> },
];

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-[250px] border-r-[.5px] border-gray fixed left-0 h-full bg-primary pt-8">
      <div className="pl-2 mb-1">
        <p className=" text-gray">Categories</p>
      </div>
      <ul className="flex flex-col gap-1">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center gap-2 cursor-pointer pl-2 py-2 text-[#D3E3FD] hover:bg-primary-light hover:text-white"
          >
            <div>{category.icon}</div>
            <p>{category.name}</p>
          </div>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
