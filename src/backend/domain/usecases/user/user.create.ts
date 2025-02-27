import { UserCreateData } from "../../entities";

/**
 * Interface que define o caso de uso para criação de usuário
 * @interface
 */
export interface UserCreateUseCase {
  /**
   * Cria um novo usuário no sistema
   * @param data Dados do usuário a ser criado
   * @returns Promise que resolve quando o usuário é criado com sucesso
   */
  create: (data: UserCreateData) => Promise<void>;
}
