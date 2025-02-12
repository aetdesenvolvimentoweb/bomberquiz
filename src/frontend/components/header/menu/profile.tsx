import { JwtTokenHandlerAdapter } from "@/backend/infra/adapters/jsonwebtoken/auth.token-handler";
import Link from "next/link";
import { LogoutButton } from "../../logout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUser = async () => {
  const cookiesStored = await cookies();
  const token = cookiesStored.get("_BomberQuiz_Session_Token");

  if (token) {
    const jwtTokenHandler = new JwtTokenHandlerAdapter();
    const userLogged = jwtTokenHandler.verify(token.value.split("Bearer_")[1]);

    if (!userLogged) {
      // toastify de erro
      redirect("/login");
    }

    return userLogged;
  }
};
export const MenuProfile = async () => {
  const userLogged = await getUser();

  return (
    <div className="relative group">
      {/* <div className="hidden md:flex items-center gap-6">{userLogged?.name}</div> */}
      <button className="bg-red-800 rounded-full focus:outline-none border-2 border-transparent hover:border-white focus:border-white">
        {userLogged?.name[0]}
      </button>
      <div className="absolute min-w-[220px] hidden group-hover:flex flex-col gap-2 right-0 p-2 rounded-md bg-background text-foreground border-2 shadow-md">
        <div className="flex flex-col items-center pb-2 border-b-2">
          <span className="font-semibold">{userLogged?.name}</span>
          <span className="font-light">{userLogged?.email}</span>
        </div>
        <ul className="w-full border-b-2 pb-2">
          <li>
            <Link
              className="flex hover:bg-gray-100 focus:bg-gray-100 p-2"
              href={"/"}
            >
              Desempenho
            </Link>
          </li>
          <li>
            <Link
              className="flex hover:bg-gray-100 focus:bg-gray-100 p-2"
              href={"/"}
            >
              Dados Pessoais
            </Link>
          </li>
          <li>
            <Link
              className="flex hover:bg-gray-100 focus:bg-gray-100 p-2"
              href={"/"}
            >
              Alterar Senha
            </Link>
          </li>
        </ul>
        <LogoutButton />
      </div>
    </div>
  );
};
