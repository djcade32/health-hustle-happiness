"use server";

import { Article } from "@/types";
import { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import { TaskFunction } from "puppeteer-cluster/dist/Cluster";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

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
  {
    website: "https://www.financialsamurai.com/",
    scrapeFunction: scrapeFinancialSamurai,
  },
  {
    website: "https://www.moneyunder30.com/",
    scrapeFunction: scrapeMoneyUnder30,
  },
  {
    website: "https://www.mrmoneymustache.com/blog/",
    scrapeFunction: scrapeMrMoneyMustache,
  },
  {
    website: "https://moneymorning.com/",
    scrapeFunction: scrapeMoneyMorning,
  },
  {
    website: "https://breakingmuscle.com/fitness/",
    scrapeFunction: scrapeBreakingMuscle,
  },
  {
    website: "https://chuzefitness.com/blog",
    scrapeFunction: scrapeChuzeFitness,
  },
  {
    website: "https://www.nerdfitness.com/blog/",
    scrapeFunction: scrapeNerdFitness,
  },
  {
    website: "https://www.anytimefitness.com/ccc/workouts/",
    scrapeFunction: scrapeAnytimeFitness,
  },
  {
    website: "https://www.nami.org/Blogs/NAMI-Blog",
    scrapeFunction: scrapeNami,
  },
  {
    website: "https://www.bphope.com/bipolar-disorder/",
    scrapeFunction: scrapeBphope,
  },
  {
    website: "https://www.blurtitout.org/blog/",
    scrapeFunction: scrapeBlurt,
  },
  {
    website: "https://mybrainsnotbroken.com/",
    scrapeFunction: scrapeMyBrainsNotBroken,
  },
];

export async function runScrapers(): Promise<Article[]> {
  console.log("INFO: Starting to scrape all websites");
  let cluster: any;
  if (process.env.NODE_ENV === "development") {
    console.log("INFO: Running in development mode");
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
      puppeteerOptions: {
        headless: "new",
      },
    });
  } else {
    console.log("INFO: Running in production mode");
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
      puppeteer: puppeteer,
      puppeteerOptions: {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      },
    });
  }
  console.log("INFO: Cluster created");

  const allArticles: Article[] = [];
  const scrapersToRetry: { website: string; scrapeFunction: TaskFunction<any, any> }[] = [];

  // Run all scrapers
  const scrapersPromise: Promise<void> = new Promise((resolve) => {
    SCRAPERS.forEach(async (scraper) => {
      try {
        console.log(`INFO: Starting to scrape ${scraper.website}`);
        const scrapedWebsiteArticles = await cluster.execute(
          scraper.website,
          scraper.scrapeFunction
        );
        if (!scrapedWebsiteArticles) return;
        allArticles.push(...scrapedWebsiteArticles);
        console.log(
          `INFO: Finished scraping ${scraper.website}, retrieved: `,
          scrapedWebsiteArticles.length
        );
        // console.log("INFO: Scraped articles: ", scrapedWebsiteArticles);
      } catch (error: any) {
        console.log(`Error scraping ${scraper.website}: ${error.message}`);
        if (error.message.includes("timeout")) {
          scrapersToRetry.push(scraper);
          console.log("INFO: Added scraper to retry: ", scraper);
        }
      }
    });
    resolve();
  });
  await scrapersPromise;
  console.log("INFO: Scrapers to retry: ", scrapersToRetry);

  // Retry scrapers that timed out
  if (scrapersToRetry.length > 0) {
    console.log("INFO: Retrying scrapers: ", scrapersToRetry);
    scrapersToRetry.forEach(async (scraper) => {
      try {
        const scrapedWebsiteArticles = await cluster.execute(
          scraper.website,
          scraper.scrapeFunction
        );
        if (!scrapedWebsiteArticles) return;
        console.log(
          `INFO: Finished scraping ${scraper.website}, retrieved: `,
          scrapedWebsiteArticles.length
        );
        allArticles.push(...scrapedWebsiteArticles);
      } catch (error: any) {
        console.log(`Error scraping on retry${scraper.website}: ${error.message}`);
      }
    });
  }

  await cluster.idle();
  await cluster.close();
  console.log("INFO: Finished scraping all websites, retrieved: ", allArticles.length);
  return allArticles;
}

type Props = {
  page: Page;
  data: string;
};
//Personal Finance Scrapers
async function scrapeYahooFinance({ page, data: url }: Props): Promise<Article[]> {
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
      let logo = "https://s.yimg.com/cv/apiv2/default/20211027/logo-18-18.svg";
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeNerdWallet({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });
  const lastPosition = await scrollPageToBottom(page, {});

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("._2wzVEH._3PPwi1");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("span._2GdPcq._24b0kK.DFVVwC._1My7YX")?.textContent?.trim();
      let image = article.querySelector("img._3_C3La")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://www.nerdwallet.com/cdn/favicon.ico";
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapePennyHoarder({ page, data: url }: Props): Promise<Article[]> {
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
      let logo = "https://www.thepennyhoarder.com/favicon.png";
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeFinancialSamurai({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("ul.wp-block-latest-posts__list > li");
    if (!articles) return;

    articles.forEach((article) => {
      let title = article.querySelector("a.wp-block-latest-posts__post-title")?.textContent?.trim();
      let image = article.querySelector("img.wp-post-image")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a.wp-block-latest-posts__post-title")?.getAttribute("href");
      let logo = "/assets/websiteLogos/financialSamurai.jpeg";
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
        websiteName: "Financial Samurai",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeMoneyUnder30({ page, data: url }: Props): Promise<Article[]> {
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
    const articles = document.querySelectorAll("div.gb-grid-column-6d808e59");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("h2.gb-headline")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("srcset");
      image = image && getImageUrlFromDataSrcSet(image);
      let date = Date.now();
      let link = article.querySelector("h2.gb-headline > a")?.getAttribute("href");
      let logo = "/assets/websiteLogos/moneyUnder30.jpeg";
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
        websiteName: "Money Under 30",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });

    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeMrMoneyMustache({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("article");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("h2.headline > a")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("h2.headline > a")?.getAttribute("href");
      let logo = "https://www.mrmoneymustache.com/wp-content/uploads/2018/03/favicon1.jpg";
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
        websiteName: "Mr Money Mustache",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });

    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeMoneyMorning({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("article");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("a.title")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a.title")?.getAttribute("href");
      let logo = "https://moneymorning.com/favicon.ico?v=m2dpb4bmQdd";
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
        websiteName: "Mr Money Mustache",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });

    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

//Physical Fitness Scrapers
async function scrapeEverydayHealth({ page, data: url }: Props): Promise<Article[]> {
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
      let type = "physical_fitness";

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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeAthletechNews({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.post.style3");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector(".post-title")?.querySelector("a")?.textContent?.trim();
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults ?? [];
}

async function scrapeFitAndWell({ page, data: url }: Props): Promise<Article[]> {
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
      let type = "physical_fitness";

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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults ?? [];
}

async function scrapeBreakingMuscle({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("article.post");
    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("a.entry-title-link")?.textContent?.trim();
      let image = article.querySelector("img.post-image")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a.entry-title-link")?.getAttribute("href");
      let logo = "/assets/websiteLogos/breakingMuscle.png";
      let type = "physical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Breaking Muscle",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults ?? [];
}

async function scrapeChuzeFitness({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });
  //scroll to bottom of page to load all articles
  const lastPosition = await scrollPageToBottom(page, {});
  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.single-post");

    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("div.post-title > a")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://chuzefitness.com/wp-content/uploads/chuze-favicon2.png";
      let type = "physical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Chuze Fitness",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults ?? [];
}

async function scrapeNerdFitness({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });
  //scroll to bottom of page to load all articles
  const lastPosition = await scrollPageToBottom(page, {});
  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("article.post");

    if (!articles) return;
    articles.forEach((article) => {
      function getImageUrlFromDataSrcSet(imageString: string): string {
        // Replace unnecessary characters and split the string into an array
        const imageUrlArray = imageString.replace(/['"]/g, "").split(/,| /);

        // Remove empty strings from the array
        const filteredUrlArray = imageUrlArray.filter(
          (url) => url.trim() !== "" && url.trim().startsWith("https")
        );
        return filteredUrlArray[filteredUrlArray.length - 1];
      }
      let title = article.querySelector("h1.entry-title > a")?.textContent?.trim();
      let image = article.querySelectorAll("img")[1]?.getAttribute("srcset");
      image = image && getImageUrlFromDataSrcSet(image);
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://www.nerdfitness.com/favicon.ico";
      let type = "physical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "NerdFitness",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults ?? [];
}

async function scrapeAnytimeFitness({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });
  //scroll to bottom of page to load all articles
  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("article.elementor-post");

    if (!articles) return;
    articles.forEach((article) => {
      let title = article.querySelector("h2.elementor-post__title > a")?.textContent?.trim();
      let image = article.querySelector("img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a.elementor-post__thumbnail__link")?.getAttribute("href");
      let logo = "https://www.anytimefitness.com/wp-content/themes/anytimefitness/favicon.ico";
      let type = "physical_fitness";

      if (!title || !image || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Anytime Fitness",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });

  return scrapedResults ?? [];
}

//Mental Health Scrapers
async function scrapeHealthline({ page, data: url }: Props): Promise<Article[]> {
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeNewsMedical({ page, data: url }: Props): Promise<Article[]> {
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
        recentlyViewedUsers: [],
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeMentalHealthFirstAid({ page, data: url }: Props): Promise<Article[]> {
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
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeNami({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.card");
    if (!articles) return;
    // Only scrape the first 10 articles
    const limit = 10;
    for (let index = 0; index < limit; index++) {
      const article = articles[index];
      if (!article) return;
      let title = article.querySelector("p.card-text")?.textContent?.trim();
      let image = article.querySelector("img.card-img-top")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://www.nami.org/App_Themes/Default/Images/favicon.ico";
      let type = "mental_health";

      if (!image?.includes("http")) {
        image = null;
      }

      if (!title || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "NAMI",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    }

    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeBphope({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.blog-post");
    if (!articles) return;

    articles.forEach(async (article) => {
      let title = article.querySelector("a.heading-link-wrap > h2")?.textContent?.trim();
      let image = article.querySelector("img.wp-post-image")?.getAttribute("data-src");
      let date = Date.now();
      let link = article.querySelector("a.heading-link-wrap")?.getAttribute("href");
      let logo = "https://www.bphope.com/wp-content/themes/bp-hope/favicons/favicon-32x32.png";
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
        websiteName: "bphope",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    });
    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeBlurt({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("div.it");
    if (!articles) return;
    // Only scrape the first 10 articles
    const limit = 10;

    for (let index = 0; index < limit; index++) {
      const article = articles[index];
      if (!article) return;
      let title = article.querySelector("h3")?.textContent?.trim();
      let image = article.querySelector("div.image-fit > img")?.getAttribute("src");
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://www.blurtitout.org/wp-content/uploads/2023/12/logo.svg";
      let type = "mental_health";

      if (!image?.includes("http")) {
        image = null;
      }

      if (!title || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "Blurt",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    }

    return scrapedArticles;
  });
  return scrapedResults ?? [];
}

async function scrapeMyBrainsNotBroken({ page, data: url }: Props): Promise<Article[]> {
  await page.goto(url, { waitUntil: "load" });

  const scrapedResults = await page.evaluate(() => {
    let scrapedArticles: Article[] = [];
    //Start scraping
    const articles = document.querySelectorAll("article.post");
    if (!articles) return;
    // Only scrape the first 10 articles
    const limit = 10;

    for (let index = 0; index < limit; index++) {
      const article = articles[index];
      if (!article) return;
      let title = article.querySelector("h2.entry-title > a")?.textContent?.trim();
      let image = null;
      let date = Date.now();
      let link = article.querySelector("a")?.getAttribute("href");
      let logo = "https://mybrainsnotbroken.files.wordpress.com/2018/08/cropped-logo.jpg?w=100";
      let type = "mental_health";

      if (!title || !date || !link || !logo || !type) return;

      const data: Article = {
        id: "",
        title,
        image,
        date,
        link,
        logo,
        type,
        websiteName: "My Brain's Not Broken",
        ranking: 0,
        usersLikes: [],
        usersBookmarks: [],
        numOfLikes: 0,
        recentlyViewedUsers: [],
      };
      scrapedArticles.push(data);
    }

    return scrapedArticles;
  });
  return scrapedResults ?? [];
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
