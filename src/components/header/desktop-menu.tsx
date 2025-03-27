"use client";
import { usePathname } from "next/navigation";

import { menuList } from "./menu-list";

export const DesktopMenu = () => {
  const menu = menuList("Administrador");
  const path = usePathname();
  const active = "rounded-md bg-accent px-3 py-2 text-accent-foreground";
  const menuItem =
    "rounded-md px-3 py-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="hidden md:ml-6 md:flex md:items-center md:justify-center md:w-full">
      <div className="flex space-x-4">
        {/* <!-- Current: "bg-secondary text-secondary-foreground", Default: "text-primary-foreground hover:bg-muted hover:text-white" --> */}
        {menu &&
          menu.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={path.valueOf().includes(item.href) ? active : menuItem}
              aria-current="page"
            >
              {item.label}
            </a>
          ))}
      </div>
    </div>
  );
};
