import { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "BomberQuiz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Header />
      <div className="flex flex-1 w-full bg-background p-2">{children}</div>
      <Footer />
    </div>
  );
}
