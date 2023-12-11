"use server";

import { Article } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeYahooFinance(): Promise<Article[] | undefined> {
  const url = "https://finance.yahoo.com/topic/personal-finance/";
  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    let scrapedArticles: Article[] = [];

    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const articles = $("li.js-stream-content");

    articles.map((_, article) => {
      const title = $(article).find("h3").text().trim();
      const image = $(article).find("img").attr("src");
      const date = Date.now();
      const link = $(article).find("a").attr("href");
      const logo = "/assets/websiteLogos/yahoo.png";
      const type = "Personal Finance";
      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        title,
        image,
        date,
        link,
        logo,
        type,
      };

      scrapedArticles.push(data);
    });

    return scrapedArticles;
  } catch (error: any) {
    console.log(error);
  }
}
