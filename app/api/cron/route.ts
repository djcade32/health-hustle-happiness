import { scrapeAndStoreArticles } from "@/lib/actions";
import { NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const scrapedArticles = scrapeAndStoreArticles();

    return NextResponse.json({
      message: "Ok",
      data: scrapedArticles,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all articles: ${error.message}`);
  }
}
