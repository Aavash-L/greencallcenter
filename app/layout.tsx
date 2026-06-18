import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SetProof — Green Star Exteriors",
  description: "Digital set verification for door-to-door roofing & exteriors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
