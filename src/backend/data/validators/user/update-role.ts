import { UpdateRoleValidatorUseCase } from "@/backend/domain/use-cases";
import { UserRole } from "@/backend/domain/entities";
import { ValidationErrors } from "../../helpers";

interface UpdateRoleValidatorDependencies {
  validationErrors: ValidationErrors;
}

export class UpdateRoleValidator implements UpdateRoleValidatorUseCase {
  private validationErrors;

  constructor(private props: UpdateRoleValidatorDependencies) {
    this.validationErrors = props.validationErrors;
  }

  private checkMissingRole = (role: UserRole): void => {
    if (!role) {
      throw this.validationErrors.missingParamError("função");
    }
  };

  private validateRole = (role: string): void => {
    if (!["administrador", "colaborador", "cliente"].includes(role)) {
      throw this.validationErrors.invalidParamError("função");
    }
  };

  public readonly validateUpdateRole = async (
    role: UserRole
  ): Promise<void> => {
    this.checkMissingRole(role);
    this.validateRole(role);
  };
}
