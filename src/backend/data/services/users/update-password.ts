import {
  EncrypterUseCase,
  UserIdValidatorUseCase,
  UserUpdatePasswordPropsValidatorUseCase,
  UserUpdatePasswordUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ConstructorProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updatePasswordPropsValidator: UserUpdatePasswordPropsValidatorUseCase;
}

export class UpdateUserPasswordService implements UserUpdatePasswordUseCase {
  constructor(private constructorProps: ConstructorProps) {}

  public readonly updatePassword = async (updatePasswordProps: {
    id: string;
    props: UpdateUserPasswordProps;
  }): Promise<void> => {
    const {
      encrypter,
      updatePasswordPropsValidator,
      userRepository,
      userIdValidator,
    } = this.constructorProps;
    const { id, props } = updatePasswordProps;

    await userIdValidator.validateUserId(id);
    await updatePasswordPropsValidator.validateUpdatePasswordProps(
      updatePasswordProps
    );
    const hashedPassword = await encrypter.encrypt(props.newPassword);
    await userRepository.updatePassword({
      ...updatePasswordProps,
      props: {
        ...props,
        newPassword: hashedPassword,
      },
    });
  };
}
