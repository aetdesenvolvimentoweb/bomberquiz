import Link from "next/link";

import { getCurrentUser, getPath } from "@/actions/auth";

import { menuList } from "./menu-list";

const menuDefault =
  "rounded-md px-3 py-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground";
const menuActive = "rounded-md bg-accent px-3 py-2 text-accent-foreground";

export const DesktopMenu = async () => {
  const path = await getPath();
  const user = await getCurrentUser();

  const menu = menuList(user?.role || "cliente");

  return (
    <div className="hidden md:ml-6 md:flex md:items-center md:justify-center md:w-full">
      <div className="flex space-x-4">
        {/* <!-- Current: "bg-secondary text-secondary-foreground", Default: "text-primary-foreground hover:bg-muted hover:text-white" --> */}
        {menu &&
          menu.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={path.includes(item.href) ? menuActive : menuDefault}
              aria-current="page"
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
};
