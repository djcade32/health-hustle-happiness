import Image from "next/image";
import React from "react";
// import companyLogo from "../public/assets/websiteLogos/msn.jpg";
import Link from "next/link";
import { Article } from "@/types";
import { formatArticleCardDate } from "@/utils";
import { Tooltip } from "antd";
import { url } from "inspector";

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  return (
    <Link
      href={article.link}
      target="_blank"
      className="flex flex-col justify-between bg-primary-light min-h-[380px] rounded-xl w-[300px] pt-5 pb-2 px-2 border-[1px] border-gray cursor-pointer hover:border-[#D3E3FD]"
    >
      <div className="mx-3">
        <div>
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
        </div>
        <div>
          <p className="text-[18px] mt-1 font-semibold line-clamp-4">{article.title}</p>
        </div>
      </div>

      <div>
        <p className="mb-1 font-thin small-text mx-3 text-gray">
          {`${formatArticleCardDate(article.date)} • `}
          <span>{article.type}</span>
        </p>
        <div
          className="h-[175px] overflow-hidden w-full bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${article.image})` }}
        />
        {/* <Image
            src={article.image}
            alt={article.title}
            width={350}
            height={175}
            className=" rounded-xl"
          /> */}
        {/* </div> */}
      </div>
    </Link>
  );
};

export default ArticleCard;
