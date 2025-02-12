import { UserRole } from "../../entities";

/**
 * Define o contrato para atualização de papel de usuários no sistema
 */
export interface UserUpdateRoleUseCase {
  /**
   * Atualiza o papel de um usuário
   * @param props Objeto contendo ID do usuário e novo papel
   */
  updateRole: (props: { id: string; role: UserRole }) => Promise<void>;
}
