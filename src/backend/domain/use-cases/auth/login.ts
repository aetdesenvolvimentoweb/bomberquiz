import { LoginProps, UserLogged } from "../../entities";

export type LoginUseCase = {
  login: (loginProps: LoginProps) => Promise<UserLogged | null>;
};
