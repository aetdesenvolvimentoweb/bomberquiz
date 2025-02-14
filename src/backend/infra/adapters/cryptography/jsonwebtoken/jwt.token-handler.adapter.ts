import { AuthTokenHandlerUseCase } from "@/backend/domain/use-cases";
import { UserLogged } from "@/backend/domain/entities";
import jwt from "jsonwebtoken";

/**
 * Implementa o caso de uso de manipulação de tokens usando JWT
 */
export class JwtTokenHandlerAdapter implements AuthTokenHandlerUseCase {
  /**
   * Gera um token JWT para o usuário
   * @param userLogged Dados do usuário autenticado
   * @returns Token JWT gerado
   */
  public readonly generate = (userLogged: UserLogged): string => {
    return jwt.sign(userLogged, "segredo", {
      expiresIn: "1d",
      subject: userLogged.id,
    });
  };

  /**
   * Verifica e decodifica um token JWT
   * @param token Token JWT a ser verificado
   * @returns Dados do usuário se o token for válido, null caso contrário
   */
  public readonly verify = (token: string): UserLogged | null => {
    return jwt.verify(token, "segredo") as UserLogged;
  };
}
