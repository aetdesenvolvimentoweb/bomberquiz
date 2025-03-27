import { ModeToggle } from "../mode-toggle";
import { Brand } from "./brand";
import { DesktopMenu } from "./desktop-menu";
import { MobileMenu } from "./mobile-menu";
import { ProfileMenu } from "./profile-menu";

export const Header = () => {
  return (
    <nav className="w-full bg-primary overflow-hidden">
      <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <MobileMenu />

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Brand />
            <DesktopMenu />
          </div>
          <div className="flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 gap-2">
            <ModeToggle />
            {/* <!-- Profile dropdown --> */}
            <ProfileMenu />
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
    </nav>
  );
};
