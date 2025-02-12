import { LoginProps, UserLogged } from "@/backend/domain/entities";

/**
 * Define o contrato para validação das propriedades de login no sistema
 */
export interface AuthLoginPropsValidatorUseCase {
  /**
   * Valida as propriedades de login do usuário
   * @param loginProps Propriedades de login a serem validadas
   * @returns Promise com dados do usuário logado
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  validateLogin: (loginProps: LoginProps) => Promise<UserLogged>;
}
