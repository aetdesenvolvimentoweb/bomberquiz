import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/frontend/styles/globals.css";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BomberQuiz",
  description:
    "App de perguntas e respostas voltado a bombeiros militares do Estado de Goiás, que visa acelerar o aprendizado e reforçar o conhecimento de matérias cobradas no Teste de Aptidão Profissional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
