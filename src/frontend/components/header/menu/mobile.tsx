"use client";

import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { menuItems } from "./items";
import { useState } from "react";

export const MenuMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const renderShowMenuIcon = () => {
    return menuOpen ? (
      <FiX className="text-3xl" />
    ) : (
      <FiMenu className="text-3xl" />
    );
  };

  const handleShowMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="md:hidden">
      <button className="text-3xl" onClick={handleShowMenu}>
        {renderShowMenuIcon()}
      </button>
      <div
        className={`absolute min-h-[91%] top-[9%] ${menuOpen ? "left-[0%]" : "left-[-100%]"} transition-all duration-500 w-full flex flex-col items-center`}
      >
        <div className="bg-gray-50 flex flex-1 w-full">
          <ul className="flex flex-col w-full p-5">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  className="flex hover:bg-gray-100 w-full transition-colors duration-200 px-5 py-2 rounded-md font-semibold text-lg"
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
