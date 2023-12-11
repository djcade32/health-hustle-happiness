import { Article } from "@/types";
import { getFirebaseDB } from "../firebase";
import { scrapeYahooFinance } from "../scraper";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function scrapeAndStoreArticles() {
  try {
    const db = getFirebaseDB();
    if (!db) return;

    const scrapedArticles = await scrapeYahooFinance();

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
  } catch (error: any) {
    throw new Error(`Failed to scrape and store articles: ${error.message}`);
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
