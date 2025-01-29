import {
  EncrypterUseCase,
  UpdatePasswordPropsValidatorUseCase,
  UpdateUserPasswordUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface UpdateUserPasswordServiceProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updatePasswordPropsValidator: UpdatePasswordPropsValidatorUseCase;
}

export class UpdateUserPasswordService implements UpdateUserPasswordUseCase {
  constructor(private props: UpdateUserPasswordServiceProps) {}

  public readonly updatePassword = async (
    props: UpdateUserPasswordProps
  ): Promise<void> => {
    const {
      encrypter,
      updatePasswordPropsValidator,
      userRepository,
      userIdValidator,
    } = this.props;

    await userIdValidator.validateUserId(props.id);
    await updatePasswordPropsValidator.validateUpdatePasswordProps(props);
    const hashedPassword = await encrypter.encrypt(props.newPassword);
    await userRepository.updatePassword({
      ...props,
      newPassword: hashedPassword,
    });
  };
}
