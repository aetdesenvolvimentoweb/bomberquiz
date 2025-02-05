"use client";

import { Brand } from "./brand";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="px-10 py-6">
      <nav className="flex justify-between items-center">
        <div className="flex-1 flex items-center justify-center">
          <Brand />
        </div>
        <div className={`${pathname.includes("login") ? "hidden" : ""}`}>
          <Link
            className="min-w-8 min-h-8 bg-green-300 hover:bg-green-200 font-semibold py-2 px-6 rounded-md text-lg md:text-base"
            href="/login"
          >
            Entrar
          </Link>
        </div>
      </nav>
    </header>
  );
};
