/**
 * Interface que define o validador de data de nascimento
 * @interface
 */
export interface UserBirthdateValidatorUseCase {
  /**
   * Valida se a data de nascimento é válida
   * Pode verificar se a data é válida, se o usuário tem idade mínima, etc.
   * @param birthdate Data de nascimento a ser validada
   * @throws {InvalidParamError} Se a data de nascimento for inválida
   */
  validate: (birthdate: Date) => Promise<void>;
}
