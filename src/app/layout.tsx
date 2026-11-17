import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matchup Lowdown",
  description: "Dota 2 safe-lane 2v2 matchup analyser",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className="h-full antialiased">
    <body className="min-h-full flex flex-col bg-gray-950">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 px-4 py-3 backdrop-blur-sm">
        <span className="text-sm font-semibold tracking-wide text-white">
          Matchup Lowdown
        </span>
      </header>
      {children}
    </body>
  </html>
);

export default RootLayout;
