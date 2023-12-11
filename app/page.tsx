import ArticleCard from "@/components/ArticleCard";
import { getArticles, scrapeAndStoreArticles } from "@/lib/actions";
import { Article } from "@/types";
import { get } from "http";

const article: Article = {
  title: "How to Shop at Aldi and the Best Ways To Save",
  link: "https://www.moneytalksnews.com/slideshows/how-to-shop-at-aldi-and-the-best-ways-to-save/",
  date: Date.now(),
  image:
    "https://www.moneytalksnews.com/workers/images/width=1460/wp-content/uploads/2021/12/24211028/shutterstock_1590343318-scaled.jpg?s=d7037249cd3464a63a679077e980ebbf8f52c1caff961b05ff807b776f31910a",
  logo: "/../public/assets/websiteLogos/msn.jpg",
  type: "Personal Finance",
};

export default async function Home() {
  const articles = await getArticles();
  console.log("length: ", articles?.length);
  return (
    <section className="flex flex-1 max-w-fit">
      <div className="flex flex-wrap gap-8 ">
        {articles?.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </section>
  );
}
