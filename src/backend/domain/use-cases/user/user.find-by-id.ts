import { UserMapped } from "../../entities";

/**
 * Define o contrato para busca de usuários por ID no sistema
 */
export interface UserFindByIdUseCase {
  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário a ser buscado
   */
  findById: (id: string) => Promise<UserMapped | null>;
}
