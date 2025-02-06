import "@/frontend/styles/globals.css";
import { Footer } from "@/frontend/components/footer";
import { Header } from "@/frontend/components/header/private";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className="flex flex-col flex-1">{children}</div>
      <Footer />
    </div>
  );
}
