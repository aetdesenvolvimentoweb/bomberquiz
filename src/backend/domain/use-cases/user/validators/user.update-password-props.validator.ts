import { UpdateUserPasswordProps } from "@/backend/domain/entities";

/**
 * Define o contrato para validação das propriedades de atualização de senha no sistema
 */
export interface UserUpdatePasswordPropsValidatorUseCase {
  /**
   * Valida as propriedades necessárias para atualização de senha
   * @param props Objeto contendo ID do usuário e dados da nova senha
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  validateUpdatePasswordProps: (props: {
    id: string;
    props: UpdateUserPasswordProps;
  }) => Promise<void>;
}
