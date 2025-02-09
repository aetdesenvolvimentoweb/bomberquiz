import { UserProps } from "../../entities";

/**
 * Define o contrato para criação de usuários no sistema
 */
export interface CreateUserUseCase {
  /**
   * Cria um novo usuário no sistema
   * @param userProps Propriedades necessárias para criar um usuário
   */
  create: (userProps: UserProps) => Promise<void>;
}
