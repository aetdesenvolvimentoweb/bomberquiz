import { UserCreateData } from "@/backend/domain/entities";

/**
 * Interface que define o sanitizador para dados de criação de usuário
 * @interface
 */
export interface UserCreateDataSanitizerUseCase {
  /**
   * Sanitiza os dados de entrada do usuário
   * @param data Dados do usuário a serem sanitizados
   * @returns Dados sanitizados
   */
  sanitize: (data: UserCreateData) => UserCreateData;
}
