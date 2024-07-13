import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./components/MaxWidthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent platform",
  description: "AI agent platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <MaxWidthWrapper>
              <Navbar />
              {children}
            </MaxWidthWrapper>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
