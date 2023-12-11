import Image from "next/image";
import React from "react";
import companyLogo from "../public/assets/msn.jpg";
import Link from "next/link";
import { Article } from "@/types";

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  return (
    <Link
      href={article.link}
      target="_blank"
      className="flex flex-col justify-between bg-primary-light min-h-[380px] rounded-xl max-w-[300px] pt-5 pb-2 px-2 border-[1px] border-transparent cursor-pointer hover:border-white"
    >
      <div className="mx-3">
        <Image src={companyLogo} alt="health hustle happiness" className="rounded-full w-8 h-8" />
        <div>
          <p className="text-[18px] mt-1">{article.title}</p>
        </div>
      </div>

      <div>
        <p className="mb-1 font-thin small-text mx-3">{`${article.date} • ${article.readTime}m read time`}</p>
        <div className="max-w-fit rounded-xl overflow-hidden bg-white">
          <Image src={article.image} alt="Aldi store" width={350} height={200} />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
