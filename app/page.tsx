import Feed from "@/components/Feed";
import Navbar from "@/components/Navbar";
import OnboardingModal from "@/components/OnboardingModal";
import Sidebar from "@/components/Sidebar";
import AppContextProvider from "@/context/AppContext";
import { scrapeAndStoreArticles, updateArticles } from "@/lib/actions";

export default function Home() {
  // updateArticles();
  // scrapeAndStoreArticles();

  return (
    <AppContextProvider>
      <Navbar />
      <main className="flex flex-row ">
        <Sidebar />
        {/* <main className="flex flex-1 ml-[350px] mr-[100px] pt-[50px] debug-1"> */}
        <main className="flex flex-1 min-[1020px]:ml-[250px] justify-center pt-5">
          <Feed />
        </main>
      </main>
      <OnboardingModal />
    </AppContextProvider>
  );
}
