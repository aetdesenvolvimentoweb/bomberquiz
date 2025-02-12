import { UserRole } from "@/backend/domain/entities";

/**
 * Define o contrato para validação de atualização de papel no sistema
 */
export interface UserUpdateRoleValidatorUseCase {
  /**
   * Valida o papel a ser atualizado
   * @param role Novo papel do usuário
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  validateUpdateRole: (role: UserRole) => Promise<void>;
}
