import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import theme from "@/theme/themeConfig";
import { ConfigProvider } from "antd";
import AppContextProvider from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import OnboardingModal from "@/components/OnboardingModal";
import AboutUsModal from "@/components/AboutUsModal";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Health Hustle Happiness",
  description:
    "Health Hustle Happiness is uniting personal finance, mental health, and fitness articles for a well-rounded lifestyle and empowering your journey to balanced well-being",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <ConfigProvider theme={theme}>
          <body className={`${poppins.className} flex flex-col`}>
            <AppContextProvider>
              <Navbar />
              {children}
              <OnboardingModal />
              <AboutUsModal />
            </AppContextProvider>
          </body>
        </ConfigProvider>
      </StyledComponentsRegistry>
    </html>
  );
}
