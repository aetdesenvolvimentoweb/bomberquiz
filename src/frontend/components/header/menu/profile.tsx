import { JwtTokenHandlerAdapter } from "@/backend/infra/adapters/jsonwebtoken/token-handler";
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
    <div className="hidden md:flex items-center gap-6">{userLogged?.name}</div>
  );
};
