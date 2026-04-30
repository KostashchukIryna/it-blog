import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { GoogleAnalytics } from '@next/third-parties/google'


const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog.IT - Новини технологій",
  description: "Найактуальніші новини з технологічного світу",
  robots: "index, follow",
  verification: {
    google: "15sVple1_vw-CvARaogsP6UgaB5wj3iNoWnLQ4Hex30",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${raleway.className} antialiased min-h-screen bg-gray-50 flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="p-4 border-t text-center text-xs text-gray-400">
          Blog.IT - 2026
        </footer>
        <GoogleAnalytics gaId="G-MTVG42Q514" /> 
      </body>
    </html>
  );
}
