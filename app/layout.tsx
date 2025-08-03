import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWrapper from "./client-wrapper";
import { Roboto_Mono } from 'next/font/google';

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Resume Refiner AI",
  description: "Resume Refiner AI - AI Powered Resume Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-black dark:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
