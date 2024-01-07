import { Article, FilterType, GetArticlesType, QueryConditionFilterType } from "@/types";
import { getFirebaseDB } from "../firebase";
import { scrapeMentalHealthFirstAid } from "../scrapers";
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
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
  orderByField: string,
  conditions?: QueryConditionFilterType[],
  startAtArticle?: any
): Query<DocumentData, DocumentData> | null {
  const db = getFirebaseDB();
  if (!db) return null;

  const articlesRef = collection(db, "articles");
  let createdQuery = query(articlesRef, orderBy(orderByField, "desc"), limit(limitNum));

  let queryConditions = buildQueryConditions(conditions);
  if (queryConditions.length > 0) {
    createdQuery = query(
      articlesRef,
      orderBy(orderByField, "desc"),
      limit(limitNum),
      ...queryConditions
    );
  }
  if (startAtArticle !== null && startAtArticle !== undefined) {
    createdQuery = query(
      articlesRef,
      orderBy(orderByField, "desc"),
      limit(limitNum),
      ...queryConditions,
      startAfter(startAtArticle)
    );
  }

  return createdQuery;
}

export async function getArticles(
  filter: FilterType,
  userId?: string,
  startAtArticle?: QueryDocumentSnapshot<DocumentData, DocumentData> | null
): Promise<GetArticlesType | undefined> {
  try {
    let limitNum = 20;
    let orderByField = "id";
    const conditions: QueryConditionFilterType[] = [
      {
        field: "type",
        operator: "==",
        value: filter,
      },
    ];

    if (filter === filters.BOOKMARKS && userId) {
      orderByField = "date";
      conditions.push({
        field: "usersBookmarks",
        operator: "array-contains",
        value: userId,
      });
    }
    if (filter === filters.MOST_LIKED) {
      orderByField = "numOfLikes";
      conditions.push({
        field: "numOfLikes",
        operator: ">",
        value: 0,
      });
    }
    if (filter === filters.RECENTLY_VIEWED && userId) {
      orderByField = "date";
      conditions.push({
        field: "recentlyViewedUsers",
        operator: "array-contains",
        value: userId,
      });
    }
    if (filter === filters.POPULAR) {
      //ToDo: Add logic to take into account date article is added
      orderByField = "ranking";
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
