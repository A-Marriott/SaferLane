import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matchup Lowdown",
  description: "Dota 2 safe-lane 2v2 matchup analyser",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className="h-full antialiased">
    <body className="min-h-full flex flex-col">{children}</body>
  </html>
);

export default RootLayout;
