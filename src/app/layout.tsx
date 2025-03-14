import "@/frontend/styles/globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montSerrat = Montserrat({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BomberQuiz",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${montSerrat.className} antialiased`}>{children}</body>
    </html>
  );
}
