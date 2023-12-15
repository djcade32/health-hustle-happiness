import ArticleCard from "@/components/ArticleCard";
import { getArticles, scrapeAndStoreArticles } from "@/lib/actions";
import {
  scrapeNerdWallet,
  scrapePennyHoarder,
  scrapeEverydayHealth,
  scrapeAthletechNews,
  scrapeFitAndWell,
  scrapeHealthline,
  scrapeNewsMedical,
  scrapeMentalHealthFirstAid,
} from "@/lib/scrapers";

export default async function Home() {
  // const articles = await scrapeNerdWallet();
  // console.log(articles);
  // await scrapeAndStoreArticles();
  const articles = await getArticles();

  // if (!articles) {
  //   return (
  //     <section className="flex flex-1 max-w-fit">
  //       <div className="flex flex-wrap gap-8 ">
  //         <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-gray-100 rounded-lg">
  //           <h1 className="text-4xl font-bold text-gray-800">Loading...</h1>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

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
