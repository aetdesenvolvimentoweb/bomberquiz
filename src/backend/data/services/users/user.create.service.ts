import {
  EncrypterUseCase,
  UserCreateUseCase,
  UserCreationPropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UserCreateServiceProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userCreationPropsValidator: UserCreationPropsValidatorUseCase;
}

/**
 * Implementa o serviço de criação de usuário no sistema
 */
export class UserCreateService implements UserCreateUseCase {
  private encrypter;
  private userRepository;
  private userCreationPropsValidator;

  constructor(private props: UserCreateServiceProps) {
    this.encrypter = props.encrypter;
    this.userRepository = props.userRepository;
    this.userCreationPropsValidator = props.userCreationPropsValidator;
  }

  /**
   * Cria um novo usuário no sistema
   * @param userProps Propriedades do usuário a ser criado
   * @throws {ErrorApp} Quando a operação falhar
   */
  public create = async (userProps: UserProps): Promise<void> => {
    await this.userCreationPropsValidator.validateUserCreationProps(userProps);
    const hashedPassword = await this.encrypter.encrypt(userProps.password);
    await this.userRepository.create({
      ...userProps,
      password: hashedPassword,
    });
  };
}
