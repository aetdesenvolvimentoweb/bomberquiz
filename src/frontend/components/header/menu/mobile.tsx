"use client";

import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { menuItems } from "./items";
import { useState } from "react";

export const MenuMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const renderShowMenuIcon = () => {
    return menuOpen ? (
      <FiX className="w-6 h-6" />
    ) : (
      <FiMenu className="w-6 h-6" />
    );
  };

  const handleShowMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="md:hidden">
      <button
        className="flex items-center justify-center border-2 border-transparent hover:border-white focus:border-white"
        onClick={handleShowMenu}
      >
        {renderShowMenuIcon()}
      </button>
      <div
        className={`absolute flex flex-col items-center w-full min-h-[calc(100vh-144px)] top-24 ${menuOpen ? "left-[0%]" : "left-[-100%]"} transition-all duration-500`}
      >
        <div className="bg-gray-100 flex-1 w-full">
          <ul className="p-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  className="flex px-5 py-2 text-lg font-semibold text-foreground hover:bg-gray-200 transition-colors duration-200 rounded-md"
                  href={item.url}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
