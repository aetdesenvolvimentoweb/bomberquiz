import { InvalidParamError } from "@/backend/domain/errors";
import { UserPasswordValidatorUseCase } from "@/backend/domain/validators";

/**
 * Implementação do validador de senha
 * Verifica se a senha atende aos requisitos mínimos de segurança
 * @implements {UserPasswordValidatorUseCase}
 */
export class UserPasswordValidator implements UserPasswordValidatorUseCase {
  /**
   * Valida se a senha atende aos requisitos mínimos
   * Atualmente verifica apenas o comprimento mínimo de 8 caracteres
   * @param password Senha a ser validada
   * @throws {InvalidParamError} Se a senha não atender aos requisitos mínimos
   */
  public readonly validate = (password: string): void => {
    if (password.length < 8) {
      throw new InvalidParamError("senha deve ter no mínimo 8 caracteres.");
    }
  };
}
