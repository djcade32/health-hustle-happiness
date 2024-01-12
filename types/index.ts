import { Unsubscribe } from "firebase/auth";
import { DocumentData, QueryDocumentSnapshot, WhereFilterOp } from "firebase/firestore";

export type Article = {
  id: string;
  scrapeSessionId?: number;
  title: string;
  image: string | null;
  date: number;
  link: string;
  logo: string;
  type: string;
  websiteName: string;
  ranking: number;
  usersLikes: string[];
  usersBookmarks: string[];
  numOfLikes: number;
};

export type UserType = {
  id: string;
  email: string;
  fullName: string;
};

export type FilterType =
  | "all"
  | "mental_health"
  | "physical_fitness"
  | "personal_finance"
  | "popular"
  | "most_liked"
  | "bookmarks"
  | "recently_viewed";

export type FilterTypes = {
  ALL: FilterType;
  PERSONAL_FINANCE: FilterType;
  PHYSICAL_FITNESS: FilterType;
  MENTAL_HEALTH: FilterType;
  POPULAR: FilterType;
  MOST_LIKED: FilterType;
  BOOKMARKS: FilterType;
  RECENTLY_VIEWED: FilterType;
};

export type GlobalFiltersType = {
  tabFilter: FilterType;
  otherFilters: FilterType[];
};

export type QueryConditionFilterType = {
  field: string;
  operator: WhereFilterOp;
  value: FilterType | string | number;
};

export type GetArticlesType = {
  articles: Article[];
  lastArticle: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
  unsubscribe?: Unsubscribe;
};
