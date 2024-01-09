"use server";

import { Article } from "@/types";
import { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";

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

const SCRAPERS = [
  {
    website: "https://finance.yahoo.com/topic/personal-finance/",
    scrapeFunction: scrapeYahooFinance,
  },
  {
    website: "https://www.nerdwallet.com/h/category/personal-finance?trk=nw_gn_6.0",
    scrapeFunction: scrapeNerdWallet,
  },
  {
    website: "https://www.thepennyhoarder.com/save-money/",
    scrapeFunction: scrapePennyHoarder,
  },
  {
    website: "https://www.everydayhealth.com/fitness/all-articles/",
    scrapeFunction: scrapeEverydayHealth,
  },
  {
    website: "https://athletechnews.com/category/fitness/",
    scrapeFunction: scrapeAthletechNews,
  },
  {
    website: "https://www.fitandwell.com/fitness",
    scrapeFunction: scrapeFitAndWell,
  },
  {
    website: "https://www.healthline.com/mental-health",
    scrapeFunction: scrapeHealthline,
  },
  {
    website: "https://www.news-medical.net/condition/Mental-Health",
    scrapeFunction: scrapeNewsMedical,
  },
  {
    website: "https://www.mentalhealthfirstaid.org/news-and-updates/",
    scrapeFunction: scrapeMentalHealthFirstAid,
  },
];

export async function runScrapers() {
  console.time("scrapeTimer");

  console.log("INFO: Starting to scrape all websites");
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteerOptions: {
      headless: "new",
    },
  });

  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  SCRAPERS.forEach((scraper) => {
    cluster.queue(scraper.website, scraper.scrapeFunction);
  });

  await cluster.idle();
  await cluster.close();
  console.timeEnd("scrapeTimer");
  console.log("INFO: Finished scraping all websites");
}

type Props = {
  page: Page;
  data: string;
};

async function scrapeYahooFinance({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape yahoo finance");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("li.js-stream-content");
    if (!articles) return;

    articles.forEach((article) => {
      let title = article.querySelector("h3")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "/assets/websiteLogos/yahoo.png";
      let type = "personal_finance";
      if (!title || !image || !date || !link || !logo || !type) return;
      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Yahoo",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

async function scrapeNerdWallet({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape nerd wallet");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("._2wzVEH._3PPwi1");
    if (!articles) return;

    articles.forEach((article) => {
      let title = article.querySelector("span._2GdPcq._24b0kK.DFVVwC._1My7YX")?.textContent?.trim();
      let image = "/assets/images/nerdwalletArticlePlaceholder.jpg";
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "/assets/websiteLogos/nerdwallet.png";
      let type = "personal_finance";
      if (!title || !image || !date || !link || !logo || !type) return;
      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "NerdWallet",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

async function scrapePennyHoarder({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape penny hoarder");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
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
      let title = article.querySelector("a.photo-essay-article-content-title")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("data-srcset");
      image = image && getImageUrlFromDataSrcSet(image);
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "/assets/websiteLogos/pennyhoarder.png";
      let type = "personal_finance";
      if (!title || !image || !date || !link || !logo || !type) return;
      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Penny Hoarder",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

async function scrapeEverydayHealth({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape everyday health");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll(
      "article.category-index-article.category-index-article--regular"
    );
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("a.cr-anchor")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("data-src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://images.everydayhealth.com/images/site-images/favicon.png";
      let type = "pysical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Everyday Health",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

async function scrapeAthletechNews({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape Athletech News");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.post.style3");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector(".post-title")?.querySelector("a")?.textContent.trim();
      let image = article.querySelector("img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo =
        "https://athletechnews.com/wp-content/uploads/2021/08/ATHLETECH-FAVICON-KNOCKOUT-LRG-48x48.png";
      let type = "pysical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Athletech News",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults;
}

async function scrapeFitAndWell({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape Fit and Well");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
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
      let type = "pysical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Fit and Well",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults;
}

async function scrapeHealthline({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape Healthline");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.css-1p72dae ul li");
    if (!articles) return;
    articles.forEach(async (article) => {
      let title = article.querySelectorAll("a")[1]?.lastChild?.textContent?.trim();
      let image = article.querySelector("lazy-image")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo =
        "https://images-prod.healthline.com/hlcmsresource/images/frontend-static/favicon/hl-logo-logomark-circle-black.ico";
      let type = "mental_health";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Healthline",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

async function scrapeNewsMedical({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape News Medical");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    let articles = document.querySelectorAll("article.overview-article");
    if (!articles) return;
    articles.forEach(async (article) => {
      let title = article.querySelector("h4")?.querySelector("a")?.textContent?.trim();
      let image = article
        .querySelector("a")
        ?.getAttribute("style")
        ?.split('url("')[1]
        .split('")')[0]
        .trim();
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://www.news-medical.net/favicon-32x32.png";
      let type = "mental_health";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "News Medical Life Science",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
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
      let link = "https://www.news-medical.net" + article.querySelector("a")?.getAttribute("href");
      let logo = "https://www.news-medical.net/favicon-32x32.png";
      let type = "Mental Health";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "News Medical Life Science",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

async function scrapeMentalHealthFirstAid({ page, data: url }: Props) {
  console.log("INFO: Starting to scrape Mental Health First Aid");
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
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
      let type = "mental_health";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Mental Health First Aid",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults;
}

//TODO: Add more scrapers

// function getImageUrlFromDataSrcSet(imageString: string): string {
//   // Replace unnecessary characters and split the string into an array
//   const imageUrlArray = imageString.replace(/['"]/g, "").split(/,| /);

//   // Remove empty strings from the array
//   const filteredUrlArray = imageUrlArray.filter(
//     (url) => url.trim() !== "" && url.trim().startsWith("https")
//   );
//   return filteredUrlArray[filteredUrlArray.length - 1];
// }

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
