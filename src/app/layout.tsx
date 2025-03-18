import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/frontend/styles/globals.css";

const montserrat = Montserrat({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BomberQuiz",
  description: "Quiz para Bombeiros de Goiás",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
