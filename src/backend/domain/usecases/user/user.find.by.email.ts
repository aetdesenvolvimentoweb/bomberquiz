import { User } from "../../entities";

/**
 * Interface que define o caso de uso para criação de usuário
 * @interface
 */
export interface UserFindByEmailUseCase {
  /**
   * Cria um novo usuário no sistema
   * @param id Id do usuário a ser consultado
   * @returns Promise que resolve quando o usuário é encontrado ou null
   */
  findByEmail: (id: string) => Promise<User | null>;
}
