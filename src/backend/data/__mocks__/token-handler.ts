/* eslint-disable @typescript-eslint/no-unused-vars */
import { TokenHandlerUseCase } from "@/backend/domain/use-cases";
import { UserLogged } from "@/backend/domain/entities";

export class TokenHandlerStub implements TokenHandlerUseCase {
  public readonly generate = (userLogged: UserLogged): string => {
    return "any_token";
  };

  public readonly verify = (token: string): UserLogged | null => {
    return {
      id: "valid_id",
      name: "any_name",
      email: "valid_email",
      role: "cliente",
    };
  };
}
