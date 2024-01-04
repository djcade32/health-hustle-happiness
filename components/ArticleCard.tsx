"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Article } from "@/types";
import { convertSnakeCaseToTitleCase, formatArticleCardDate } from "@/utils";
import { Tooltip } from "antd";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import { MdOpenInNew } from "react-icons/md";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { PiShareFat } from "react-icons/pi";
import { useAppContext } from "@/context/AppContext";

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  const { user, setShowOnboardingModal, likeArticle, bookmarkArticle, globalFilters } =
    useAppContext();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(0);

  // Set bookmark and like state on mount
  useEffect(() => {
    if (!user) {
      setIsBookmarked(false);
      setIsLiked(false);
    } else {
      setIsBookmarked(article.usersBookmarks.includes(user?.id));
      setIsLiked(article.usersLikes.includes(user?.id));
    }
    setNumOfLikes(article.usersLikes.length);
  }, [user?.id, article]);

  const handleBookmark = () => {
    if (!user) return setShowOnboardingModal(true);
    if (isBookmarked) {
      bookmarkArticle(article.id, "unbookmark");
    } else {
      bookmarkArticle(article.id, "bookmark");
    }
    return setIsBookmarked((prev) => !prev);
  };

  const handleLike = () => {
    if (!user) return setShowOnboardingModal(true);
    if (isLiked) {
      likeArticle(article.id, "unlike");
      setNumOfLikes((prev) => prev - 1);
    } else {
      likeArticle(article.id, "like");
      setNumOfLikes((prev) => prev + 1);
    }
    return setIsLiked((prev) => !prev);
  };

  return (
    <div className="group flex flex-col justify-between bg-primary-light min-h-[380px] rounded-xl w-[300px] pt-5 pb-2 px-2 border-[1px] border-gray  hover:border-[#D3E3FD] transition-all duration-300 group-hover:opacity-0">
      <div className="mx-3">
        <div className="flex justify-between">
          <Tooltip
            title={article.websiteName}
            placement="bottom"
            color="white"
            overlayInnerStyle={{ color: "#021525", fontSize: "12px" }}
          >
            <Image
              src={article.logo}
              alt="health hustle happiness"
              className="rounded-full w-8 h-8"
              width={50}
              height={50}
            />
          </Tooltip>
          <Link
            href={article.link}
            target="_blank"
            className="bg-white opacity-0 text-primary max-w-fit py-1 px-2 rounded-xl cursor-pointer flex items-center gap-1 hover:opacity-75 group-hover:opacity-100"
          >
            <p>Read</p>
            <MdOpenInNew size={20} />
          </Link>
        </div>
        <div>
          <p className="text-[18px] mt-2 font-semibold line-clamp-4">{article.title}</p>
        </div>
      </div>

      <div>
        <p className="mb-1 font-thin small-text mx-3 text-gray">
          {`${formatArticleCardDate(article.date)} • `}
          <span>{convertSnakeCaseToTitleCase(article.type)}</span>
        </p>
        <div
          className="h-[175px] overflow-hidden w-full bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${article.image})` }}
        />

        <div className="flex flex-row justify-between pt-2 pb-1 px-[30px] ">
          <div className="flex gap-1 items-center cursor-pointer" onClick={handleLike}>
            <div className="hover:bg-gray transition-colors duration-300 rounded-md flex justify-center p-1">
              {isLiked ? <IoHeartSharp size={25} /> : <IoHeartOutline size={25} />}
            </div>
            {numOfLikes > 0 && <p>{numOfLikes}</p>}
          </div>
          <div className="flex gap-1 items-center cursor-pointer" onClick={handleBookmark}>
            <div className="hover:bg-gray transition-colors duration-300 rounded-md flex justify-center p-1">
              {isBookmarked ? <PiBookmarkSimpleFill size={25} /> : <PiBookmarkSimple size={25} />}
            </div>
          </div>
          <div className="flex gap-1 items-center cursor-pointer" onClick={() => {}}>
            <div className="hover:bg-gray transition-colors duration-300 rounded-md flex justify-center p-1">
              <PiShareFat size={25} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
