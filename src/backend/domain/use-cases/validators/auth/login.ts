import { LoginProps } from "@/backend/domain/entities";

export type LoginValidatorUseCase = {
  validateLogin: (loginProps: LoginProps) => Promise<void>;
};
