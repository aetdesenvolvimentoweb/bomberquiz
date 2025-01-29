import {
  UpdateRoleValidatorUseCase,
  UpdateUserRoleUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserRoleProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface UpdateUserRoleServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updateRoleValidator: UpdateRoleValidatorUseCase;
}

export class UpdateUserRoleService implements UpdateUserRoleUseCase {
  constructor(private props: UpdateUserRoleServiceProps) {}

  public readonly updateRole = async (
    props: UpdateUserRoleProps
  ): Promise<void> => {
    const { updateRoleValidator, userRepository, userIdValidator } = this.props;

    await userIdValidator.validateUserId(props.id);
    await updateRoleValidator.validateUpdateRole(props.role);
    await userRepository.updateRole(props);
  };
}
