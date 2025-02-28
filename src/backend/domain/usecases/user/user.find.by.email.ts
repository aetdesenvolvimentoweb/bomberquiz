import { User } from "../../entities";

/**
 * Interface que define o caso de uso para busca de usuário por email
 * @interface
 */
export interface UserFindByEmailUseCase {
  /**
   * Busca um usuário pelo email
   * @param email Email do usuário a ser consultado
   * @returns Promise que resolve com o usuário encontrado ou null se não existir
   */
  findByEmail: (email: string) => Promise<User | null>;
}
