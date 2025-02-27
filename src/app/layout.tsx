import "@/frontend/styles/globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BomberQuiz",
  description:
    "Site especializado em acelerar e reforçar o aprendizado de matérias exigidas no Teste de Aptidão Profissional do Corpo de Bombeiros Militar do Estado de Goiás.",
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
