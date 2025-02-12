/**
 * Define o contrato para validação de telefone no sistema
 */
export interface UserPhoneValidatorUseCase {
  /**
   * Valida um número de telefone
   * @param phone Número de telefone a ser validado
   * @returns Boolean indicando se o telefone é válido
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  isValid: (phone: string) => boolean;
}
