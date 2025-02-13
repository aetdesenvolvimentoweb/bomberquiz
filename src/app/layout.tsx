import "@/frontend/styles/globals.css";
import { ErrorBoundary } from "@/frontend/components/error-boundary";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "BomberQuiz",
  description:
    "Aplicação para turbinar os estudos de matérias exigidas no TAP - Teste de Aptidão Profissional do Corpo de Bombeiros Militar do Estado de Goiás.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
