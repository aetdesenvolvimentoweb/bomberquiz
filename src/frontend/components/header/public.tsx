"use client";

import { Brand } from "./brand";
import { LoginButton } from "../login";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center h-24 px-3 bg-[#880000] text-white">
      <div className="flex flex-1 justify-center items-center">
        <Brand />
      </div>
      <nav>
        <div className={`${pathname.includes("login") ? "hidden" : ""}`}>
          <LoginButton />
        </div>
      </nav>
    </header>
  );
};
