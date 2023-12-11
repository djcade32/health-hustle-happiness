import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Health Hustle Happiness",
  description:
    "Health Hustle Happiness is uniting personal finance, mental health, and fitness articles for a well-rounded lifestyle and empowering your journey to balanced well-being",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <main className="flex flex-row ">
          <Sidebar />
          <main className="flex flex-1 ml-[350px] mr-[100px] pt-[50px]">{children}</main>
        </main>
      </body>
    </html>
  );
}
