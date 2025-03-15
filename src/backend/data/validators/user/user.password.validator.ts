import { InvalidParamError } from "@/backend/domain/errors";
import { UserPasswordValidatorUseCase } from "@/backend/domain/validators";

export class UserPasswordValidator implements UserPasswordValidatorUseCase {
  public readonly validate = (password: string): void => {
    if (password.length < 8) {
      throw new InvalidParamError("senha deve ter no mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      throw new InvalidParamError(
        "senha deve ter pelo menos uma letra maiúscula",
      );
    }
    if (!/[a-z]/.test(password)) {
      throw new InvalidParamError(
        "senha deve ter pelo menos uma letra minúscula",
      );
    }
    if (!/[0-9]/.test(password)) {
      throw new InvalidParamError("senha deve ter pelo menos um número");
    }
    const hasSpecialChar =
      /[!@#$%^&*(),.?":{}|<>]/.test(password) || // Caracteres especiais ASCII comuns
      /[^\w\s]/.test(password) || // Qualquer caractere não alfanumérico além dos ASCII comuns
      /[\u0080-\uFFFF]/.test(password); // Caracteres Unicode fora do range ASCII (inclui emojis)

    if (!hasSpecialChar) {
      throw new InvalidParamError(
        "senha deve ter pelo menos um caractere especial (@, #, $, %, etc.)",
      );
    }
  };
}
