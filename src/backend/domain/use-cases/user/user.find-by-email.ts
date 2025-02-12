import { User } from "../../entities";

/**
 * Define o contrato para busca de usuários por email no sistema
 */
export interface UserFindByEmailUseCase {
  /**
   * Busca um usuário pelo email
   * @param email Email do usuário a ser buscado
   */
  findByEmail: (email: string) => Promise<User | null>;
}
