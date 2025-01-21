import { UserRole } from "../../../entities";

export type UpdateRoleValidatorUseCase = {
  validateUpdateRole: (role: UserRole) => Promise<void>;
};
