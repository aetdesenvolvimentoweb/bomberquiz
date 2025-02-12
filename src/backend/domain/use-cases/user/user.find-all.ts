import { UserMapped } from "../../entities";

/**
 * Define o contrato para listagem de usuários do sistema
 */
export interface UserFindAllUseCase {
  /**
   * Lista todos os usuários cadastrados no sistema
   * @returns Promise com array de usuários mapeados
   */
  findAll: () => Promise<UserMapped[]>;
}
