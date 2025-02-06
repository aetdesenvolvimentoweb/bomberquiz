import { MenuDesktop, MenuMobile, MenuProfile } from "./menu";
import { Brand } from "./brand";

export const Header = () => {
  return (
    <header className="flex justify-between items-center h-24 px-3 bg-[#880000] text-white">
      <Brand />
      <nav className="flex flex-1">
        <MenuDesktop />
        <MenuMobile />
        <MenuProfile />
      </nav>
    </header>
  );
};
