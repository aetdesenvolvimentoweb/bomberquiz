import { headers } from "next/headers";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Footer } from "../footer";
import { Brand } from "./brand";
import { menuList } from "./menu-list";

const menuDefault =
  "block rounded-md px-3 py-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground";
const menuActive = "block rounded-md bg-muted px-3 py-2 text-muted-foreground";

export const MobileMenu = async () => {
  const menu = menuList("Administrador");
  const headersList = await headers();
  const pathname = headersList.get("referer");

  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md p-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <FiMenu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="md:hidden w-[100vw] max-w-[100vw] sm:max-w-[100vw] bg-primary text-primary-foreground"
      >
        <SheetHeader>
          <SheetTitle>
            <Brand />
          </SheetTitle>
          <div className="md:hidden py-6" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
              {menu &&
                menu.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={
                      pathname?.includes(item.href) ? menuActive : menuDefault
                    }
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>
        </SheetHeader>
        <SheetFooter>
          <Footer />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
