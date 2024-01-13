import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "../globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import theme from "@/theme/themeConfig";
import { ConfigProvider } from "antd";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Privacy Policy | Health Hustle Happiness",
  description: "Health Hustle Happiness Privacy Policy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <ConfigProvider theme={theme}>
          <body className={`${poppins.className} custom-scrollbar`}>{children}</body>
        </ConfigProvider>
      </StyledComponentsRegistry>
    </html>
  );
}
