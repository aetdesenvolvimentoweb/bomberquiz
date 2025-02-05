import { MenuDesktop, MenuMobile, MenuProfile } from "./menu";
import { Brand } from "./brand";

export const Header = () => {
  return (
    <header className="px-10 py-6">
      <nav className="flex justify-between items-center">
        <Brand />
        <MenuDesktop />
        <MenuMobile />
        <MenuProfile />
      </nav>
    </header>
  );
};
