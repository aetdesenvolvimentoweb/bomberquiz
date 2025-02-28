/**
 * Interface que define o validador de formato de telefone
 * @interface
 */
export interface UserPhoneValidatorUseCase {
  /**
   * Valida se o telefone tem um formato válido
   * @param phone Telefone a ser validado
   * @throws {InvalidParamError} Se o telefone tiver formato inválido
   */
  validate: (phone: string) => void;
}
