"use server";

import { Article } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";

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

export async function scrapeYahooFinance(): Promise<Article[] | undefined> {
  const url = "https://finance.yahoo.com/topic/personal-finance/";

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
        id: uuidv4(),
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Yahoo",
        ranking: 0,
      };

      scrapedArticles.push(data);
    });

    return scrapedArticles;
  } catch (error: any) {
    console.log("ERROR: Error scraping Yahoo Finance");
    console.log(error);
  }
}

export async function scrapeNerdWallet() {
  const url = "https://www.nerdwallet.com/h/category/personal-finance?trk=nw_gn_6.0";
  try {
    let scrapedArticles: Article[] = [];

    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const articles = $("._2wzVEH._3PPwi1");

    articles.map((_, article) => {
      const title = $(article).find("span._2GdPcq._24b0kK.DFVVwC._1My7YX").text().trim();
      const image = "/assets/images/nerdwalletArticlePlaceholder.png";
      const date = Date.now();
      const link = $(article).find("a").attr("href");
      const logo = "/assets/websiteLogos/nerdwallet.png";
      const type = "Personal Finance";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: uuidv4(),
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "NerdWallet",
        ranking: 0,
      };
      scrapedArticles.push(data);
    });

    return scrapedArticles;
  } catch (error: any) {
    console.log(error);
  }
}

export async function scrapePennyHoarder() {
  console.log("INFO: Starting to scrape penny hoarder");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.thepennyhoarder.com/save-money/", { waitUntil: "load" });

    const grabArticles = await page.evaluate(() => {
      function getImageUrlFromDataSrcSet(imageString: string): string {
        // Replace unnecessary characters and split the string into an array
        const imageUrlArray = imageString.replace(/['"]/g, "").split(/,| /);

        // Remove empty strings from the array
        const filteredUrlArray = imageUrlArray.filter(
          (url) => url.trim() !== "" && url.trim().startsWith("https")
        );
        return filteredUrlArray[filteredUrlArray.length - 1];
      }

      let scrapedArticles: Article[] = [];

      //Start scraping
      const articles = document.querySelectorAll("div.category-subcategory-post");
      if (!articles) return;

      articles.forEach((article) => {
        let title = article.querySelector("a.photo-essay-article-content-title")?.textContent;
        let image = article.querySelector("img")?.getAttribute("data-srcset");
        image = image && getImageUrlFromDataSrcSet(image);
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo = "/assets/websiteLogos/pennyhoarder.png";
        let type = "Personal Finance";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "Penny Hoarder",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping penny hoarder");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping penny hoarder");
    console.log(error);
  }
}

export async function scrapeEverydayHealth() {
  console.log("INFO: Starting to scrape Everyday Health");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.everydayhealth.com/fitness/all-articles/", {
      waitUntil: "domcontentloaded",
    });

    const grabArticles = await page.evaluate(() => {
      let scrapedArticles: Article[] = [];

      //Start scraping
      const articles = document.querySelectorAll(
        "article.category-index-article.category-index-article--regular"
      );
      if (!articles) return;
      articles.forEach((article) => {
        let title = article.querySelector("a.cr-anchor")?.textContent;
        let image = article.querySelector("img")?.getAttribute("data-src");
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo = "https://images.everydayhealth.com/images/site-images/favicon.png";
        let type = "Physical Fitness";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "Everyday Health",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping Everyday Health");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping Everyday Health");
    console.log(error);
  }
}

export async function scrapeAthletechNews() {
  console.log("INFO: Starting to scrape Athletech News");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://athletechnews.com/category/fitness/", {
      waitUntil: "domcontentloaded",
    });

    const grabArticles = await page.evaluate(() => {
      let scrapedArticles: Article[] = [];

      //Start scraping
      const articles = document.querySelectorAll("div.post.style3");
      if (!articles) return;
      articles.forEach((article) => {
        let title = article.querySelector(".post-title")?.querySelector("a")?.textContent;
        let image = article.querySelector("img")?.getAttribute("src");
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo =
          "https://athletechnews.com/wp-content/uploads/2021/08/ATHLETECH-FAVICON-KNOCKOUT-LRG-48x48.png";
        let type = "Physical Fitness";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "Athletech News",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping Athletech News");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping Athletech News");
    console.log(error);
  }
}
export async function scrapeFitAndWell() {
  console.log("INFO: Starting to scrape Fit and Well");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.fitandwell.com/fitness", {
      waitUntil: "domcontentloaded",
    });

    const grabArticles = await page.evaluate(() => {
      let scrapedArticles: Article[] = [];

      //Start scraping
      const articles = document.querySelectorAll("li.listing__item");
      if (!articles) return;
      articles.forEach((article) => {
        let title = article.querySelector("h2.listing__title")?.textContent?.trim();
        let image = article.querySelector("img")?.getAttribute("data-pin-media");
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo = "/assets/websiteLogos/fitandwell.jpeg";
        let type = "Physical Fitness";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "Fit and Well",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping Fit and Well");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping Fit and Well");
    console.log(error);
  }
}
export async function scrapeHealthline() {
  console.log("INFO: Starting to scrape Healthline");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.healthline.com/mental-health", {
      waitUntil: "domcontentloaded",
    });

    const grabArticles = await page.evaluate(() => {
      let scrapedArticles: Article[] = [];

      //Start scraping
      const articles = document.querySelectorAll("div.css-1p72dae ul li");
      if (!articles) return;
      articles.forEach(async (article) => {
        let title = article.querySelectorAll("a")[1]?.lastChild?.textContent;
        let image = article.querySelector("lazy-image")?.getAttribute("src");
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo =
          "https://images-prod.healthline.com/hlcmsresource/images/frontend-static/favicon/hl-logo-logomark-circle-black.ico";
        let type = "Mental Health";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "Healthline",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping Healthline");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping Healthline");
    console.log(error);
  }
}
export async function scrapeNewsMedical() {
  console.log("INFO: Starting to scrape News Medical");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.news-medical.net/condition/Mental-Health", {
      waitUntil: "domcontentloaded",
    });

    const grabArticles = await page.evaluate(() => {
      let scrapedArticles: Article[] = [];

      //Start scraping
      let articles = document.querySelectorAll("article.overview-article");
      if (!articles) return;
      articles.forEach(async (article) => {
        let title = article.querySelector("h4")?.querySelector("a")?.textContent;
        let image = article
          .querySelector("a")
          ?.getAttribute("style")
          ?.split('url("')[1]
          .split('")')[0]
          .trim();
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo = "https://www.news-medical.net/favicon-32x32.png";
        let type = "Mental Health";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "News Medical Life Science",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });

      articles = document.querySelectorAll("article.feature-article");
      if (!articles) return;
      articles.forEach(async (article) => {
        let title = article.querySelector("h4")?.textContent;
        let image = article
          .querySelector(".feature-article-image")
          ?.querySelector("a")
          ?.getAttribute("style")
          ?.split('url("')[1]
          .split('")')[0]
          .trim();
        let date = Date.now();
        let link =
          "https://www.news-medical.net" + article.querySelector("a")?.getAttribute("href");
        let logo = "https://www.news-medical.net/favicon-32x32.png";
        let type = "Mental Health";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "News Medical Life Science",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping News Medical");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping News Medical");
    console.log(error);
  }
}
export async function scrapeMentalHealthFirstAid() {
  console.log("INFO: Starting to scrape Mental Health First Aid");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.mentalhealthfirstaid.org/news-and-updates/", {
      waitUntil: "domcontentloaded",
    });

    const grabArticles = await page.evaluate(() => {
      let scrapedArticles: Article[] = [];

      //Start scraping
      const articles = document.querySelectorAll("div.post-blocks");
      if (!articles) return;
      articles.forEach(async (article) => {
        let title = article.querySelector("h2")?.textContent?.trim();
        let image = article
          .querySelector("div.post-block-preview")
          ?.querySelector("a")
          ?.querySelector("img")
          ?.getAttribute("src");
        let date = Date.now();
        let link = article.querySelector("a")?.getAttribute("href");
        let logo =
          "https://www.mentalhealthfirstaid.org/wp-content/themes/mentalhealthfirstaid-2014/images/favicon.png          ";
        let type = "Mental Health";

        if (!title || !image || !date || !link || !logo || !type) return;

        const data: Article = {
          id: uuidv4(),
          title,
          image,
          date,
          link,
          logo,
          type,
          websiteName: "Mental Health First Aid",
          ranking: 0,
        };
        scrapedArticles.push(data);
      });
      return scrapedArticles;
    });
    console.log("INFO: Done scraping Mental Health First Aid");
    await browser.close();
    return grabArticles;
  } catch (error) {
    console.log("ERROR: Error scraping Mental Health First Aid");
    console.log(error);
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
