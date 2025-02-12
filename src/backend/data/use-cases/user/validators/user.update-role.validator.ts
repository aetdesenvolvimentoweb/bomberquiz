import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserRole } from "@/backend/domain/entities";
import { UserUpdateRoleValidatorUseCase } from "@/backend/domain/use-cases";

interface UpdateRoleValidatorProps {
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Implementa a validação de atualização de papel no sistema
 */
export class UserUpdateRoleValidator implements UserUpdateRoleValidatorUseCase {
  private errorsValidation;

  constructor(private props: UpdateRoleValidatorProps) {
    this.errorsValidation = props.errorsValidation;
  }

  /**
   * Verifica se o papel foi informado
   * @param role Papel a ser verificado
   * @throws {ErrorApp} Quando o papel não for informado
   */
  private checkMissingRole = (role: UserRole): void => {
    if (!role) {
      throw this.errorsValidation.missingParamError("função");
    }
  };

  /**
   * Valida se o papel é permitido no sistema
   * @param role Papel a ser validado
   * @throws {ErrorApp} Quando o papel for inválido
   */
  private validateAllowedRole = (role: string): void => {
    if (!["administrador", "colaborador", "cliente"].includes(role)) {
      throw this.errorsValidation.invalidParamError("função");
    }
  };

  /**
   * Valida o papel a ser atualizado
   * @param role Novo papel do usuário
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  public validateUpdateRole = async (role: UserRole): Promise<void> => {
    this.checkMissingRole(role);
    this.validateAllowedRole(role);
  };
}
