/**
 * Interface que define o validador de formato de email
 * @interface
 */
export interface UserEmailValidatorUseCase {
  /**
   * Valida se o email tem um formato válido
   * @param email Email a ser validado
   * @throws {InvalidParamError} Se o email tiver formato inválido
   */
  validate: (email: string) => Promise<void>;
}
