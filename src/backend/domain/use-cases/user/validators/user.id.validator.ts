/**
 * Define o contrato para validação de ID de usuário no sistema
 */
export interface UserIdValidatorUseCase {
  /**
   * Valida o ID de um usuário
   * @param id Identificador único do usuário
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  validateUserId: (id: string) => Promise<void>;
}
