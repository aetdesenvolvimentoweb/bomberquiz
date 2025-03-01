import { InvalidParamError } from "@/backend/domain/errors";
import { UserEmailValidatorUseCase } from "@/backend/domain/validators";
import { ValidatorModule } from "../types";

/**
 * Implementação do validador de email usando validator.js
 *
 * Nota: Esta implementação usa lazy loading com importação dinâmica.
 */
export class ValidatorUserEmailValidatorAdapter
  implements UserEmailValidatorUseCase
{
  private validatorModule: ValidatorModule | null = null;
  /**
   * Carrega o módulo date-fns dinamicamente
   * @returns Módulo date-fns com as funções necessárias
   */
  private async getValidator(): Promise<ValidatorModule> {
    if (!this.validatorModule) {
      try {
        // Importação dinâmica assíncrona
        const validator = await import("validator");

        this.validatorModule = {
          isEmail: validator.isEmail,
        };
      } catch (error) {
        throw new Error(
          `Erro ao carregar validator: ${(error as Error).message}`,
        );
      }
    }
    return this.validatorModule;
  }

  /**
   * Valida se o email é válido
   * @param email Email a ser validado
   * @throws {InvalidParamError} Se o email for inválido
   *
   * Nota: Este método é assíncrono devido ao lazy loading.
   */
  public async validate(email: string): Promise<void> {
    const validator = await this.getValidator();

    // Verifica se a data é válida
    if (!validator.isEmail(email)) {
      throw new InvalidParamError("email");
    }
  }
}
