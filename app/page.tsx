import Feed from "@/components/Feed";
import { updateArticles } from "@/lib/actions";

export default async function Home() {
  // updateArticles();
  return (
    <div>
      <Feed />
    </div>
  );
}
