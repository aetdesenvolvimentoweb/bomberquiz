import {
  CreateUserUseCase,
  EncrypterUseCase,
  UserCretionPropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface CreateUserServiceProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userCreationPropsValidator: UserCretionPropsValidatorUseCase;
}

export class CreateUserService implements CreateUserUseCase {
  constructor(private props: CreateUserServiceProps) {}

  public readonly create = async (userProps: UserProps): Promise<void> => {
    const { encrypter, userRepository, userCreationPropsValidator } =
      this.props;

    await userCreationPropsValidator.validateUserCreationProps(userProps);
    const hashedPassword = await encrypter.encrypt(userProps.password);
    await userRepository.create({ ...userProps, password: hashedPassword });
  };
}
