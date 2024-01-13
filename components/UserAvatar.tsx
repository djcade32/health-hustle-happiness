import { UserType } from "@/types";
import { getFirstLetters } from "@/utils";
import React from "react";

interface props {
  user: UserType;
}

const UserAvatar = ({ user }: props) => {
  //TODO: Add menu for user profile
  const getAbbreviations = () => {
    const abbreviation = getFirstLetters(user.fullName);
    if (abbreviation.length > 2) {
      return abbreviation.slice(0, 2);
    }
    return abbreviation;
  };
  return (
    <div className="mr-2">
      <p className="font-normal text-subtitle">Welcome, {user.fullName}</p>
    </div>
  );
};

export default UserAvatar;
