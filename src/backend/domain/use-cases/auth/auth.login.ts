import { LoginProps } from "../../entities";

/**
 * Define o contrato para login de usuários no sistema
 */
export interface AuthLoginUseCase {
  /**
   * Realiza o login do usuário no sistema
   * @param loginProps Propriedades de login do usuário
   * @returns Promise com token de autenticação
   */
  login: (loginProps: LoginProps) => Promise<string>;
}
