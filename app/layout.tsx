import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AppContextProvider from "@/context/AppContext";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import theme from "@/theme/themeConfig";
import { ConfigProvider } from "antd";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Health Hustle Happiness",
  description:
    "Health Hustle Happiness is uniting personal finance, mental health, and fitness articles for a well-rounded lifestyle and empowering your journey to balanced well-being",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <html lang="en">
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <body className={poppins.className}>{children}</body>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </html>
    </AppContextProvider>
  );
}
