/**
 * Define o contrato para remoção de usuários do sistema
 */
export interface UserDeleteUseCase {
  /**
   * Remove um usuário do sistema
   * @param id Identificador único do usuário
   */
  delete: (id: string) => Promise<void>;
}
