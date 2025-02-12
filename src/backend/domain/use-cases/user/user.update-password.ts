import { UpdateUserPasswordProps } from "../../entities";

/**
 * Define o contrato para atualização de senha de usuários no sistema
 */
export interface UserUpdatePasswordUseCase {
  /**
   * Atualiza a senha de um usuário
   * @param props Objeto contendo ID do usuário e dados da nova senha
   */
  updatePassword: (props: {
    id: string;
    props: UpdateUserPasswordProps;
  }) => Promise<void>;
}
