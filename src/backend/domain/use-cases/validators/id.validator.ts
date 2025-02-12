/**
 * Define o contrato para validação de identificadores no sistema
 */
export interface IdValidatorUseCase {
  /**
   * Valida um identificador único
   * @param id Identificador a ser validado
   * @returns Boolean indicando se o identificador é válido
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  isValid: (id: string) => boolean;
}
