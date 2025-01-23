import { UserLogged } from "../../entities";

export type LoginUseCase = {
  login: (userLogged: UserLogged) => string;
};
