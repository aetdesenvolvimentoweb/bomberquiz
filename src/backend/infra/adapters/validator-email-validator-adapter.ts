import { UserEmailValidatorUseCase } from "@/backend/domain/validators";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import validator from "validator";

/**
 * Implementação concreta do validador de e-mail usando a biblioteca validator
 *
 * Esta classe implementa a lógica de validação de endereços de e-mail,
 * verificando formato, comprimento e opcionalmente domínios permitidos/bloqueados.
 *
 * @implements {UserEmailValidatorUseCase}
 */
export class ValidatorEmailValidatorAdapter
  implements UserEmailValidatorUseCase
{
  /**
   * Valida um endereço de e-mail
   *
   * @param {string} email - Endereço de e-mail a ser validado
   * @returns {void} Não retorna valor, mas lança exceção se o e-mail for inválido
   * @throws {InvalidParamError} Quando o e-mail não atende aos critérios de validação
   */
  validate(email: string): void {
    try {
      // Verifica se o formato é válido usando a biblioteca validator
      if (!validator.isEmail(email)) {
        throw new InvalidParamError("e-mail", "formato inválido");
      }
    } catch (error) {
      // Se o erro já é um ServerError ou um InvalidParamError, propaga
      if (error instanceof ServerError || error instanceof InvalidParamError) {
        throw error;
      }

      // Para outros erros da biblioteca, converte para ServerError
      throw new ServerError(error as Error);
    }
  }
}
