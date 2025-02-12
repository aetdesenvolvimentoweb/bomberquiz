import { UserProfileProps } from "@/backend/domain/entities";

/**
 * Define o contrato para validação das propriedades de atualização de perfil no sistema
 */
export interface UserUpdateProfilePropsValidatorUseCase {
  /**
   * Valida as propriedades necessárias para atualização de perfil
   * @param props Objeto contendo ID do usuário e dados do perfil
   * @throws {AppError} Quando alguma validação falhar
   */
  validateUpdateProfileProps: (props: {
    id: string;
    props: UserProfileProps;
  }) => Promise<void>;
}
