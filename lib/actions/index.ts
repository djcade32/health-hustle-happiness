import { Article, FilterType, GetArticlesType, QueryConditionFilterType } from "@/types";
import { getFirebaseDB } from "../firebase";
import { runScrapers } from "../scrapers";
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { filters } from "@/enums";
import { v4 as uuidv4 } from "uuid";

export async function scrapeAndStoreArticles() {
  try {
    console.time("scrapeAndStoreTimer");
    const db = getFirebaseDB();
    if (!db) return [];

    const scrapedArticles = await runScrapers();

    if (!scrapedArticles) return [];

    let Articles = scrapedArticles;

    let storedArticles: Article[] = [];
    const querySnapshot = await getDocs(collection(db, "articles"));
    const scrapeSessionIdSnapshot = (await getDocs(collection(db, "scrapeSessionID"))).docs[0];
    let scrapeSessionId = scrapeSessionIdSnapshot.data().scrapeSessionId;
    if (scrapeSessionIdSnapshot) {
      scrapeSessionId = scrapeSessionId + 1;
      await updateDoc(scrapeSessionIdSnapshot.ref, {
        scrapeSessionId: scrapeSessionId,
      });
    } else {
      console.log("ERROR: Failed to get scrapeSessionId, Aborting scrape and store");
      return [];
    }

    Articles.forEach(async (article) => {
      const articleId = uuidv4();

      let foundArticle = false;

      querySnapshot.forEach((doc) => {
        if (doc.data().link === article.link) {
          foundArticle = true;
          return;
        }
      });
      if (!foundArticle) {
        article.id = articleId;
        article.scrapeSessionId = scrapeSessionId;
        storedArticles.push(article);
        await addDoc(collection(db, "articles"), article);
      }
    });

    revalidatePath("/");
    console.log("INFO: Scraped and stored articles, stored articles: ", storedArticles.length);
    return storedArticles;
  } catch (error: any) {
    throw new Error(`Failed to scrape and store articles: ${error.message}`);
  } finally {
    console.timeEnd("scrapeAndStoreTimer");
  }
}

const buildQueryConditions = (
  conditions: QueryConditionFilterType[] | undefined
): QueryFieldFilterConstraint[] => {
  const queryConditions: QueryFieldFilterConstraint[] = [];
  if (conditions && conditions.length > 0) {
    conditions.forEach((condition) => {
      if (
        condition.field === "type" &&
        condition.value !== filters.PHYSICAL_FITNESS &&
        condition.value !== filters.PERSONAL_FINANCE &&
        condition.value !== filters.MENTAL_HEALTH
      ) {
        return;
      }
      queryConditions.push(where(condition.field, condition.operator, condition.value));
    });
  }
  return queryConditions;
};

function buildQuery(
  limitNum: number,
  orderByField: QueryOrderByConstraint[],
  conditions?: QueryConditionFilterType[],
  startAtArticle?: any
): Query<DocumentData, DocumentData> | null {
  const db = getFirebaseDB();
  if (!db) return null;

  const articlesRef = collection(db, "articles");
  let createdQuery = query(articlesRef, ...orderByField, limit(limitNum));

  let queryConditions = buildQueryConditions(conditions);
  if (queryConditions.length > 0) {
    createdQuery = query(articlesRef, ...orderByField, limit(limitNum), ...queryConditions);
  }
  if (startAtArticle !== null && startAtArticle !== undefined) {
    createdQuery = query(
      articlesRef,
      ...orderByField,
      limit(limitNum),
      ...queryConditions,
      startAfter(startAtArticle)
    );
  }

  return createdQuery;
}

export async function getArticles(
  filter: FilterType | null,
  userId?: string,
  startAtArticle?: QueryDocumentSnapshot<DocumentData, DocumentData> | null
): Promise<GetArticlesType | undefined> {
  // If needs more randomization add id to orderByField
  if (!filter) return;
  try {
    let limitNum = 20;
    let orderByField = [orderBy("scrapeSessionId", "desc")];
    const conditions: QueryConditionFilterType[] = [
      {
        field: "type",
        operator: "==",
        value: filter,
      },
    ];

    if (filter === filters.BOOKMARKS && userId) {
      orderByField = [orderBy("date", "desc")];
      conditions.push({
        field: "usersBookmarks",
        operator: "array-contains",
        value: userId,
      });
    }
    if (filter === filters.MOST_LIKED) {
      orderByField = [orderBy("numOfLikes", "desc")];
      // conditions.push({
      //   field: "numOfLikes",
      //   operator: ">",
      //   value: 0,
      // });
    }
    if (filter === filters.RECENTLY_VIEWED && userId) {
      orderByField = [orderBy("date", "desc")];
      conditions.push({
        field: "recentlyViewedUsers",
        operator: "array-contains",
        value: userId,
      });
    }
    if (filter === filters.POPULAR) {
      orderByField = [orderBy("ranking", "desc")];
    }
    // Build necessary query to get articles
    const query = buildQuery(limitNum, orderByField, conditions, startAtArticle);
    if (!query) return;

    //Get articles from DB
    const querySnapshot = await getDocs(query);
    const lastArticle = querySnapshot.docs[querySnapshot.docs.length - 1];

    let articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      articles.push(doc.data() as Article);
    });

    return { articles, lastArticle };
  } catch (error: any) {
    throw new Error(`Failed to get articles: ${error.message}`);
  }
}

export async function updateArticles() {
  const id = "ff9c1b7e-de66-447b-ad42-696585f5cdfb";
  try {
    const db = getFirebaseDB();
    if (!db) return;
    const querySnapshot = await getDocs(collection(db, "articles"));
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        ...doc.data(),
        recentlyViewedUsers: [],
      });
      // if (doc.data().type === "Personal Finance") {
      //   await updateDoc(doc.ref, {
      //     ...doc.data(),
      //     type: type,
      //   });
      //   return;
      // }
    });
    console.log("INFO: Updated article");
  } catch (error: any) {
    throw new Error(`Failed to update article: ${error.message}`);
  }
}
