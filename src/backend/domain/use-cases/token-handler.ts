import { UserLogged } from "../entities";

export type TokenHandlerUseCase = {
  generate: (userLogged: UserLogged) => string;
  verify: (token: string) => UserLogged | null;
};
