import {
  UpdatePasswordPropsValidatorUseCase,
  UpdateUserPasswordUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface UpdateUserPasswordServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updatePasswordPropsValidator: UpdatePasswordPropsValidatorUseCase;
}

export class UpdateUserPasswordService implements UpdateUserPasswordUseCase {
  constructor(private props: UpdateUserPasswordServiceProps) {}

  public readonly updatePassword = async ({
    id,
    oldPassword,
    newPassword,
  }: UpdateUserPasswordProps): Promise<void> => {
    const { updatePasswordPropsValidator, userRepository, userIdValidator } =
      this.props;

    await userIdValidator.validateUserId(id);
    await updatePasswordPropsValidator.validateUpdatePasswordProps({
      oldPassword,
      newPassword,
    });
    await userRepository.delete(id);
  };
}
