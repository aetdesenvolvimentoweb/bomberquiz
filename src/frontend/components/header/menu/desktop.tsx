import Link from "next/link";
import { menuItems } from "./items";

export const MenuDesktop = () => {
  return (
    <div
      className={`static min-h-fit top-[9%] transition-all duration-500 w-full flex flex-row items-center px-5`}
    >
      <div className="hidden bg-transparent md:flex flex-1 w-full">
        <ul className="flex flex-row items-center w-full p-0">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                className="flex hover:bg-gray-100 w-full transition-colors duration-200 px-5 py-2 rounded-md font-semibold text-base"
                href={item.url}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
