import { InvalidParamError } from "@/backend/domain/errors";
import { UserPasswordValidatorUseCase } from "@/backend/domain/validators";

export class UserPasswordValidator implements UserPasswordValidatorUseCase {
  public readonly validate = (password: string): void => {
    if (password.length < 8) {
      throw new InvalidParamError("senha deve ter no mínimo 8 caracteres.");
    }
  };
}
