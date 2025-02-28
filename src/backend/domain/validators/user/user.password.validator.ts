/**
 * Interface que define o validador de senha
 * @interface
 */
export interface UserPasswordValidatorUseCase {
  /**
   * Valida se a senha atende aos requisitos mínimos de segurança
   * @param password Senha a ser validada
   * @throws {InvalidParamError} Se a senha não atender aos requisitos mínimos
   */
  validate: (password: string) => void;
}
