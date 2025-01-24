import { LoginProps } from "../../entities";

export type LoginUseCase = {
  login: (loginProps: LoginProps) => Promise<string>;
};
