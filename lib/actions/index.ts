import { Article } from "@/types";
import { getFirebaseDB } from "../firebase";
import {
  scrapeAthletechNews,
  scrapeEverydayHealth,
  scrapeFitAndWell,
  scrapeHealthline,
  scrapeMentalHealthFirstAid,
  scrapeNerdWallet,
  scrapeNewsMedical,
  scrapePennyHoarder,
  scrapeYahooFinance,
} from "../scrapers";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function scrapeAndStoreArticles() {
  try {
    console.time("scrapeTimer");
    const db = getFirebaseDB();
    if (!db) return;

    const scrapedArticles = await scrapeMentalHealthFirstAid();

    if (!scrapedArticles) return;

    let Articles = scrapedArticles;
    const querySnapshot = await getDocs(collection(db, "articles"));
    Articles.forEach(async (article) => {
      let foundArticle = false;

      querySnapshot.forEach((doc) => {
        if (doc.data().link === article.link) {
          foundArticle = true;
          return;
        }
      });
      if (!foundArticle) {
        await addDoc(collection(db, "articles"), article);
      }
    });

    revalidatePath("/");
    // revalidatePath(`/products/${newProduct._id}`);
    console.log("INFO: Scraped and stored articles");
  } catch (error: any) {
    throw new Error(`Failed to scrape and store articles: ${error.message}`);
  } finally {
    console.timeEnd("scrapeTimer");
  }
}

export async function getArticles(): Promise<Article[] | undefined> {
  try {
    const db = getFirebaseDB();
    if (!db) return;

    const querySnapshot = await getDocs(collection(db, "articles"));
    let articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      articles.push(doc.data() as Article);
    });

    return articles;
  } catch (error: any) {
    throw new Error(`Failed to get articles: ${error.message}`);
  }
}
