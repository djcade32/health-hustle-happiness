"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Article } from "@/types";
import { convertSnakeCaseToTitleCase, formatArticleCardDate } from "@/utils";
import { Modal, Tooltip } from "antd";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import { MdOpenInNew } from "react-icons/md";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { PiShareFat } from "react-icons/pi";
import { useAppContext } from "@/context/AppContext";
import { filters } from "@/enums";

interface Props {
  article: Article;
  setArticleToShare: (article: Article) => void;
}

const ArticleCard = ({ article, setArticleToShare }: Props) => {
  const {
    user,
    setShowOnboardingModal,
    likeArticle,
    bookmarkArticle,
    globalFilters,
    incrementNumViews,
    addUserToRecentlyViewed,
    setShowShareModal,
    showShareModal,
  } = useAppContext();

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
    setNumOfLikes(article.numOfLikes);
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

  const handleClickToRead = () => {
    incrementNumViews(article.id);
    addUserToRecentlyViewed(article.id);
  };

  const handleShare = () => {
    if (!user) return setShowOnboardingModal(true);

    // navigator.clipboard.writeText(article.link);
    console.log("Sharing article");
    setShowShareModal(true);
    setArticleToShare(article);
    // const textToShare = "Check out this awesome content!";
    // const imageUrl = article.image;

    // // Twitter Web Intent URL
    // // const twitterIntentUrl = "https://www.reddit.com/submit?url=" + encodeURIComponent(textToShare);
    // const twitterIntentUrl =
    //   "https://twitter.com/intent/tweet?text=" +
    //   encodeURIComponent(textToShare) +
    //   "&url=" +
    //   encodeURIComponent(imageUrl);

    // // Open a new window with the Twitter intent URL
    // window.open(twitterIntentUrl, "_blank");
  };

  return (
    <>
      {globalFilters.tabFilter === filters.BOOKMARKS && !isBookmarked ? (
        <></>
      ) : (
        <div className="group flex flex-col justify-between bg-primary-light h-[415px] rounded-xl w-[300px] pt-5 pb-2 px-2 border-[1px] border-gray  hover:border-[#D3E3FD] transition-all duration-300 group-hover:opacity-0 max-[320px]:w-[270px] ">
          <div className="mx-3">
            <div className="flex justify-between">
              <Tooltip
                title={article.websiteName}
                placement="bottom"
                color="white"
                overlayInnerStyle={{ color: "#021525", fontSize: "12px" }}
              >
                {/* TODO: Add placeholder image for website logo and image */}
                <Image
                  src={article.logo}
                  alt="health hustle happiness"
                  className="rounded-full w-8 h-8"
                  width={50}
                  height={50}
                />
              </Tooltip>
              <Link
                onClick={handleClickToRead}
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
              <div className="flex gap-1 items-center">
                <Tooltip
                  title="Like"
                  placement="top"
                  color="white"
                  overlayInnerStyle={{ color: "#021525", fontSize: "12px" }}
                >
                  <div
                    className="hover:bg-gray transition-colors duration-300 rounded-md flex justify-center p-1  cursor-pointer"
                    onClick={handleLike}
                  >
                    {isLiked ? <IoHeartSharp size={25} /> : <IoHeartOutline size={25} />}
                  </div>
                </Tooltip>

                {numOfLikes > 0 && <p>{numOfLikes}</p>}
              </div>

              <div className="flex gap-1 items-center">
                <Tooltip
                  title="Bookmark"
                  placement="top"
                  color="white"
                  overlayInnerStyle={{ color: "#021525", fontSize: "12px" }}
                >
                  <div
                    className="hover:bg-gray transition-colors duration-300 rounded-md flex justify-center p-1  cursor-pointer"
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? (
                      <PiBookmarkSimpleFill size={25} />
                    ) : (
                      <PiBookmarkSimple size={25} />
                    )}
                  </div>
                </Tooltip>
              </div>
              <div className="flex gap-1 items-center">
                <Tooltip
                  title="Share"
                  placement="top"
                  color="white"
                  overlayInnerStyle={{ color: "#021525", fontSize: "12px" }}
                >
                  <div
                    className="hover:bg-gray transition-colors duration-300 rounded-md flex justify-center p-1  cursor-pointer"
                    onClick={handleShare}
                  >
                    <PiShareFat size={25} />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleCard;
