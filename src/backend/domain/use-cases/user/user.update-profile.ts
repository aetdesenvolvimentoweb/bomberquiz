import { UserProfileProps } from "../../entities";

/**
 * Define o contrato para atualização de perfil de usuários no sistema
 */
export interface UserUpdateProfileUseCase {
  /**
   * Atualiza o perfil de um usuário
   * @param props Objeto contendo ID do usuário e dados do perfil
   */
  updateProfile: (props: {
    id: string;
    props: UserProfileProps;
  }) => Promise<void>;
}
