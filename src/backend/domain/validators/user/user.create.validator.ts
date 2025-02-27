import { UserCreateData } from "../../entities";

/**
 * Interface que define o validador para criação de usuário
 * @interface
 */
export interface UserCreateValidatorUseCase {
  /**
   * Valida os dados para criação de usuário
   * @param data Dados do usuário a serem validados
   * @returns Promise que resolve se os dados forem válidos
   * @throws {MissingParamError} Se algum campo obrigatório estiver faltando
   * @throws {InvalidParamError} Se algum campo for inválido
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado
   */
  validate: (data: UserCreateData) => Promise<void>;
}
