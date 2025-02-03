import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/frontend/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/frontend/components/ui/sheet";
import { Button } from "@/frontend/components/ui/button";
import { FiUser } from "react-icons/fi";
import Image from "next/image";
import { JSX } from "react";
import Link from "next/link";
import { LogoutButton } from "../logout";
import { Menu } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface HeaderProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

const Header = ({
  logo = {
    url: "https://bomberquiz.vercel.app",
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "BomberQuiz",
    title: "BomberQuiz",
  },
  menu = [
    { title: "Home", url: "/" },
    /* {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    }, */
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],
  mobileExtraLinks = [
    { name: "Press", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Imprint", url: "#" },
    { name: "Sitemap", url: "#" },
  ],
  auth = {
    login: { text: "Login", url: "/login" },
    signup: { text: "Cadastro", url: "/cadastro" },
  },
}: HeaderProps) => {
  return (
    <section>
      <div className="w-full p-2">
        <nav className="hidden justify-between lg:flex items-center p-2">
          <div className="flex items-center gap-6">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image src={logo.src} className="w-8" alt={logo.alt} />
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button asChild variant="outline" size="sm">
              <Link href={auth.login.url}>{auth.login.text}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={auth.signup.url}>{auth.signup.text}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center rounded-full w-8 h-8">
                <FiUser className="w-6 h-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div>
                    <h2>André David</h2>
                    <span className="text-muted-foreground">
                      andredavid1@gmail.com
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image src={logo.src} className="w-8" alt={logo.alt} />
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <Image src={logo.src} className="w-8" alt={logo.alt} />
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <Link href={auth.login.url}>{auth.login.text}</Link>
                    </Button>
                    <Button asChild>
                      <Link href={auth.signup.url}>{auth.signup.text}</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="min-w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <Link
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <Link
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </Link>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </Link>
  );
};

export { Header };
