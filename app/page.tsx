import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";

const article: Article = {
  title: "How to Shop at Aldi and the Best Ways To Save",
  link: "https://www.moneytalksnews.com/slideshows/how-to-shop-at-aldi-and-the-best-ways-to-save/",
  date: "Dec 01",
  image:
    "https://www.moneytalksnews.com/workers/images/width=1460/wp-content/uploads/2021/12/24211028/shutterstock_1590343318-scaled.jpg?s=d7037249cd3464a63a679077e980ebbf8f52c1caff961b05ff807b776f31910a",
  readTime: 8,
  logo: "../public/assets/msn.jpg",
  type: "Personal Finance",
};

export default function Home() {
  return (
    <section className="flex flex-1 max-w-fit">
      <div className="flex flex-wrap gap-8 ">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <ArticleCard article={article} />
          ))}
      </div>
    </section>
  );
}
