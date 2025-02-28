/**
 * Interface que define o validador de email único
 * @interface
 */
export interface UserUniqueEmailValidatorUseCase {
  /**
   * Valida se um email é único no sistema
   * @param data Objeto contendo o email a ser validado e opcionalmente um ID de usuário
   * @param data.id ID do usuário (opcional, usado para permitir que o próprio usuário mantenha seu email em atualizações)
   * @param data.email Email a ser validado
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado para outro usuário
   * @returns Promise que resolve se o email for único
   */
  validate: (data: { id?: string; email: string }) => Promise<void>;
}
