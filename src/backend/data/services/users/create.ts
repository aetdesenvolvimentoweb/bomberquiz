import {
  CreateUserUseCase,
  EncrypterUseCase,
} from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";
import { UserValidator } from "../../validators/user";

interface CreateUserServiceProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userValidator: UserValidator;
}

export class CreateUserService implements CreateUserUseCase {
  constructor(private props: CreateUserServiceProps) {}

  public readonly create = async (userProps: UserProps): Promise<void> => {
    const { encrypter, userRepository, userValidator } = this.props;

    await userValidator.validateUserCreation(userProps);
    const hashedPassword = await encrypter.encrypt(userProps.password);
    await userRepository.create({ ...userProps, password: hashedPassword });
  };
}
