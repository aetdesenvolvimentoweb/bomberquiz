import Link from "next/link";
import { menuItems } from "./items";

export const MenuDesktop = () => {
  return (
    <div className={`flex min-h-fit w-full pl-5`}>
      <div className="hidden md:flex">
        <ul className="flex items-center">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                className="hover:bg-red-800 p-2 rounded-md font-medium"
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
