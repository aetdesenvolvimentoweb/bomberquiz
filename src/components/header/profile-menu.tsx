import Image from "next/image";
import Link from "next/link";

import { getCurrentUser, logoutUser } from "@/actions/auth";
import defaultAvatar from "@/assets/images/default_avatar.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const ProfileMenu = async () => {
  // Obter dados do usuário atual (server-side)
  const user = await getCurrentUser();

  if (!user) {
    return null; // O middleware já deve redirecionar, mas isso é uma proteção adicional
  }

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
            src={user.avatarUrl || defaultAvatar}
            title={user.avatarUrl}
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
          <div className="flex flex-col">
            <span className="bg-card text-card-foreground font-medium">
              {user?.name}
            </span>
            <span className="font-light text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="focus:bg-card">
          <div className="flex flex-col w-full gap-0.5">
            <Link
              className="w-full rounded-md text-base p-2 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
              href={`usuario/perfil/${user?.id}`}
            >
              Perfil
            </Link>
            <Link
              className="w-full rounded-md text-base p-2 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
              href={`usuario/desempenho/${user?.id}`}
            >
              Desempenho
            </Link>
            <Link
              className="w-full rounded-md text-base p-2 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
              href={`usuario/assinatura/${user?.id}`}
            >
              Assinatura
            </Link>
          </div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="focus:bg-card">
          <Button
            type="button"
            className="w-full flex items-center justify-start rounded-md text-base font-normal p-2 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
            onClick={logoutUser}
          >
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
