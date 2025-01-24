import { LoginProps, UserLogged } from "@/backend/domain/entities";

export type LoginValidatorUseCase = {
  validateLogin: (loginProps: LoginProps) => Promise<UserLogged>;
};
