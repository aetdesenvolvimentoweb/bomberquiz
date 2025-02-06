"use client";

import { Brand } from "./brand";
import { FiLogIn } from "react-icons/fi";
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
            className="flex items-center justify-center gap-2 min-w-8 min-h-8 bg-green-300 hover:bg-green-200 font-semibold py-2 px-3 rounded-md text-lg md:text-base"
            title="Entrar"
            href="/login"
          >
            <FiLogIn className="w-6 h-6" />
            <span className="hidden md:block">Entrar</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};
