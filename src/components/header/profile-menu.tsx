import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "../ui/separator";

export const ProfileMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground outline-2 outline-transparent hover:outline-white transition-colors duration-150 ease-in-out overflow-hidden"
        >
          <span className="sr-only">Abrir menu do usuário</span>
          <Image
            className="block rounded-full object-cover w-full h-full"
            src="https://github.com/andredavid1.png"
            alt="foto de perfil do usuário"
            width={32}
            height={32}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border border-border shadow-lg shadow-border"
      >
        <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent">
          <div>
            <p className="font-medium">André David</p>
            <span className="font-light text-muted-foreground">
              andredavid1@gmail.com
            </span>
          </div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Link href={"/perfil"}>Perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/perfil"}>Desempenho</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/perfil"}>Assinatura</Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Link href={"/logout"}>Sair</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
