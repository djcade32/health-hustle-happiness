"use client";

import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { Article, GetArticlesType } from "@/types";
import { getArticles } from "@/lib/actions";
import { useAppContext } from "@/context/AppContext";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Spin } from "antd";
import { BsFilePost } from "react-icons/bs";
import ShareModal from "./ShareModal";

const Feed = () => {
  const { globalFilters, user, setShowShareModal, showShareModal } = useAppContext();
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastArticle, setLastArticle] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [loadingInitialArticles, setLoadingInitialArticles] = useState(true);
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [articleToShare, setArticleToShare] = useState<Article | null>(null);

  //TODO: Look into how this is being calculated
  const BOTTOM_OFFSET = document.documentElement.scrollHeight * 0.18;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Fetch articles on load and tab change
  useEffect(() => {
    const fetchArticles = async () => {
      console.log("fetching articles");
      scrollToTop();
      try {
        // Start loading
        setLoadingInitialArticles(true);
        const articles = (await getArticles(globalFilters.tabFilter, user?.id)) as GetArticlesType;

        setArticles(articles.articles);
        setLastArticle(articles.lastArticle);
      } catch (error) {
        console.log("ERROR: There was a problem fetching articles ");
        console.log(error);
      } finally {
        // Finish loading
        setLoadingInitialArticles(false);
      }
    };

    fetchArticles();
  }, [globalFilters]);

  // Fetch more articles on bottom of page reached
  useEffect(() => {
    if (loadingMoreArticles || loadingInitialArticles) return;
    const fetchArticles = async () => {
      try {
        // Check to see if there are more articles to fetch
        if (!lastArticle) return;

        setLoadingMoreArticles(true);
        const articles = (await getArticles(
          globalFilters.tabFilter,
          user?.id,
          lastArticle
        )) as GetArticlesType;
        if (!articles) {
          setLoadingMoreArticles(false);
          return;
        }
        setArticles((prev) => [...prev, ...articles.articles]);
        setLastArticle(articles.lastArticle ?? null);
      } catch (error) {
        console.log("ERROR: There was a problem fetching more articles ");
        console.log(error);
      } finally {
        setLoadingMoreArticles(false);
        console.log("finished fetching more articles");
      }
    };

    fetchArticles();
  }, [nextPage]);

  useEffect(() => {
    if (isAtBottom && !loadingMoreArticles) {
      setNextPage((prev) => prev + 1);
      setIsAtBottom(false);
    }
  }, [isAtBottom]);

  //Determine if reached bottom of page
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight - BOTTOM_OFFSET
    ) {
      setIsAtBottom(true);
      setNextPage((prev) => prev + 1);
    }
  };

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <>
      {loadingInitialArticles ? (
        <div className="flex justify-center w-full">
          <div className="flex items-center ">
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <>
          {articles.length > 0 ? (
            <section className="flex w-full justify-center">
              <div className="grid grid-cols-4 gap-8 max-[1560px]:grid-cols-3 max-[1230px]:grid-cols-2  max-[670px]:grid-cols-1 min-[2150px]:grid-cols-5 ">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={index}
                    article={article}
                    setArticleToShare={setArticleToShare}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="flex justify-center w-full">
              <div className="flex items-center ">
                <BsFilePost size={30} color="#D3E3FD" />
                <p className="ml-2 subtitle-text text-[#D3E3FD]">No articles found</p>
              </div>
            </div>
          )}
        </>
      )}
      <ShareModal
        isOpen={showShareModal}
        setIsOpen={() => setShowShareModal(false)}
        article={articleToShare}
      />
    </>
  );
};

export default Feed;
