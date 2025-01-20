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
  userValidator: UserCretionPropsValidatorUseCase;
}

export class CreateUserService implements CreateUserUseCase {
  constructor(private props: CreateUserServiceProps) {}

  public readonly create = async (userProps: UserProps): Promise<void> => {
    const { encrypter, userRepository, userValidator } = this.props;

    await userValidator.validateUserCreationProps(userProps);
    const hashedPassword = await encrypter.encrypt(userProps.password);
    await userRepository.create({ ...userProps, password: hashedPassword });
  };
}
