/**
 * Define o contrato para validação de datas no sistema
 */
export interface DateValidatorUseCase {
  /**
   * Valida uma data
   * @param date Data a ser validada
   * @returns Boolean indicando se a data é válida
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  isValid: (date: Date) => boolean;

  /**
   * Verifica se a idade é maior ou igual a 18 anos
   * @param birthdate Data de nascimento
   * @returns Boolean indicando se a pessoa é maior de idade
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  isAdult: (birthdate: Date) => boolean;
}
