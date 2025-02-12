import {
  UserIdValidatorUseCase,
  UserUpdateRoleUseCase,
  UserUpdateRoleValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserRepository } from "../../repositories";
import { UserRole } from "@prisma/client";

interface constructorProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updateRoleValidator: UserUpdateRoleValidatorUseCase;
}

export class UpdateUserRoleService implements UserUpdateRoleUseCase {
  constructor(private constructorProps: constructorProps) {}

  public readonly updateRole = async (updateRoleProps: {
    id: string;
    role: UserRole;
  }): Promise<void> => {
    const { updateRoleValidator, userRepository, userIdValidator } =
      this.constructorProps;
    const { id, role } = updateRoleProps;

    await userIdValidator.validateUserId(id);
    await updateRoleValidator.validateUpdateRole(role);
    await userRepository.updateRole(updateRoleProps);
  };
}
