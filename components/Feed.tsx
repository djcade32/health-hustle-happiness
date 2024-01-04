"use client";

import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { Article, GetArticlesType, GlobalFiltersType } from "@/types";
import { getArticles } from "@/lib/actions";
import { useAppContext } from "@/context/AppContext";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const Feed = () => {
  const { globalFilters } = useAppContext();
  const [currentGlobalFilters, setCurrentGlobalFilters] =
    useState<GlobalFiltersType>(globalFilters);
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastArticle, setLastArticle] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [loadingInitialArticles, setLoadingInitialArticles] = useState(true);
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const BOTTOM_OFFSET = document.documentElement.scrollHeight * 0.18;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Fetch articles on load and tab change
  useEffect(() => {
    const fetchArticles = async () => {
      scrollToTop();
      try {
        // Start loading
        setLoadingInitialArticles(true);
        const articles = (await getArticles(globalFilters.tabFilter)) as GetArticlesType;

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

    setCurrentGlobalFilters(globalFilters);
    fetchArticles();
  }, [globalFilters]);

  // Fetch more articles on bottom of page reached
  useEffect(() => {
    // if (loadingInitialArticles || loadingMoreArticles) return;
    if (loadingMoreArticles || loadingInitialArticles) return;
    const fetchArticles = async () => {
      try {
        // Check to see if there are more articles to fetch
        if (!lastArticle) return;

        setLoadingMoreArticles(true);
        const articles = (await getArticles(
          globalFilters.tabFilter,
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
    // console.log("innerHeight: ", window.innerHeight);
    // console.log("scrollTop: ", document.documentElement.scrollTop);
    // console.log("scrollHeight: ", document.documentElement.scrollHeight);
    // console.log("Bottom offset: ", BOTTOM_OFFSET);
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
    <section className="flex flex-1 max-w-fit">
      <div className="flex flex-wrap gap-8 ">
        {articles?.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </section>
  );
};

export default Feed;
