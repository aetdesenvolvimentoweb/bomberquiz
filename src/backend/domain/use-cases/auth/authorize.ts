import { LoginProps, UserLogged } from "../../entities";

export type AuthorizeUseCase = {
  authorize: (loginProps: LoginProps) => Promise<UserLogged | null>;
};
