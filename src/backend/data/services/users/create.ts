import {
  EncrypterUseCase,
  UserCreateUseCase,
  UserCretionPropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ConstructorProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userCreationPropsValidator: UserCretionPropsValidatorUseCase;
}

export class CreateUserService implements UserCreateUseCase {
  constructor(private constructorProps: ConstructorProps) {}

  public readonly create = async (createProps: UserProps): Promise<void> => {
    const { encrypter, userRepository, userCreationPropsValidator } =
      this.constructorProps;

    await userCreationPropsValidator.validateUserCreationProps(createProps);
    const hashedPassword = await encrypter.encrypt(createProps.password);
    await userRepository.create({ ...createProps, password: hashedPassword });
  };
}
