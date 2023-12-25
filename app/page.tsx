import Feed from "@/components/Feed";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { scrapeAndStoreArticles, updateArticles } from "@/lib/actions";

export default function Home() {
  // updateArticles();
  // scrapeAndStoreArticles();

  return (
    <>
      <Navbar />
      <main className="flex flex-row ">
        <Sidebar />
        <main className="flex flex-1 ml-[350px] mr-[100px] pt-[50px]">
          <Feed />
        </main>
      </main>
    </>
  );
}
