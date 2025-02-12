/**
 * Define o contrato para validação de emails no sistema
 */
export interface EmailValidatorUseCase {
  /**
   * Valida um endereço de email
   * @param email Email a ser validado
   * @returns Boolean indicando se o email é válido
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  isValid: (email: string) => boolean;
}
