import Content from "@/components/Content";
import { runScrapers } from "@/lib/scrapers";

export default function Home() {
  runScrapers();

  return <Content />;
}
