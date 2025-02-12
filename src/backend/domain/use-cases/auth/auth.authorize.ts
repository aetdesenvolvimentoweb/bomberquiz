import { LoginProps, UserLogged } from "../../entities";

/**
 * Define o contrato para autorização de usuários no sistema
 */
export interface AuthAuthorizeUseCase {
  /**
   * Autoriza um usuário no sistema
   * @param loginProps Propriedades de login do usuário
   * @returns Promise com dados do usuário logado ou null
   */
  authorize: (loginProps: LoginProps) => Promise<UserLogged | null>;
}
