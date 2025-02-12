import { UserProps } from "@/backend/domain/entities";

/**
 * Define o contrato para validação das propriedades de criação de usuário
 */
export interface UserCreationPropsValidatorUseCase {
  /**
   * Valida as propriedades necessárias para criação de um usuário
   * @param userProps Propriedades do usuário a serem validadas
   * @throws {AppError} Quando alguma validação falhar
   */
  validateUserCreationProps: (userProps: UserProps) => Promise<void>;
}
