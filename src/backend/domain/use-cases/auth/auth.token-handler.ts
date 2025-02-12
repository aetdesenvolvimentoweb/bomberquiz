import { UserLogged } from "../../entities";

/**
 * Define o contrato para manipulação de tokens de autenticação no sistema
 */
export interface AuthTokenHandlerUseCase {
  /**
   * Gera um token de autenticação
   * @param userLogged Dados do usuário autenticado
   * @returns Token de autenticação
   */
  generate: (userLogged: UserLogged) => string;

  /**
   * Verifica e decodifica um token de autenticação
   * @param token Token de autenticação
   * @returns Dados do usuário autenticado ou null se token inválido
   */
  verify: (token: string) => UserLogged | null;
}
