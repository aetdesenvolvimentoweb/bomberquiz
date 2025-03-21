/**
 * Adaptador para validação de números de telefone usando a biblioteca libphonenumber-js
 */

import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { UserPhoneValidatorUseCase } from "@/backend/domain/validators";
import { parsePhoneNumber } from "libphonenumber-js/min";

/**
 * Implementação do validador de telefone utilizando libphonenumber-js
 */
export class LibphonenumberPhoneValidator implements UserPhoneValidatorUseCase {
  /**
   * Valida um número de telefone
   *
   * @param {string} phone - Número de telefone a ser validado
   * @throws {MissingParamError} Quando o número de telefone não é fornecido
   * @throws {InvalidParamError} Quando o número de telefone é inválido
   */
  validate(phone: string): void {
    try {
      // Tenta analisar o número de telefone
      const phoneNumber = parsePhoneNumber(phone, "BR");

      // Verifica se o número é válido
      if (!phoneNumber.isValid()) {
        throw new InvalidParamError("telefone", "formato inválido");
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
