import { TokenHandlerUseCase } from "@/backend/domain/use-cases";
import { UserLogged } from "@/backend/domain/entities";
import jwt from "jsonwebtoken";

export class JwtTokenHandlerAdapter implements TokenHandlerUseCase {
  public readonly generate = (userLogged: UserLogged): string => {
    return jwt.sign(userLogged, "segredo", {
      expiresIn: "1d",
      subject: userLogged.id,
    });
  };

  public readonly verify = (token: string): UserLogged | null => {
    return jwt.verify(token, "segredo") as UserLogged;
  };
}
