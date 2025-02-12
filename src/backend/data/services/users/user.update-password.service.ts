import {
  EncrypterUseCase,
  UserIdValidatorUseCase,
  UserUpdatePasswordPropsValidatorUseCase,
  UserUpdatePasswordUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UserUpdatePasswordServiceProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updatePasswordPropsValidator: UserUpdatePasswordPropsValidatorUseCase;
}

/**
 * Implementa o serviço de atualização de senha de usuário no sistema
 */
export class UserUpdatePasswordService implements UserUpdatePasswordUseCase {
  private encrypter;
  private userRepository;
  private userIdValidator;
  private updatePasswordPropsValidator;

  constructor(private props: UserUpdatePasswordServiceProps) {
    this.encrypter = props.encrypter;
    this.userRepository = props.userRepository;
    this.userIdValidator = props.userIdValidator;
    this.updatePasswordPropsValidator = props.updatePasswordPropsValidator;
  }

  /**
   * Atualiza a senha de um usuário
   * @param updatePasswordData Objeto contendo ID do usuário e dados da nova senha
   * @throws {ErrorApp} Quando a operação falhar
   */
  public updatePassword = async (updatePasswordData: {
    id: string;
    props: UpdateUserPasswordProps;
  }): Promise<void> => {
    const { id, props } = updatePasswordData;

    await this.userIdValidator.validateUserId(id);
    await this.updatePasswordPropsValidator.validateUpdatePasswordProps(
      updatePasswordData
    );
    const hashedPassword = await this.encrypter.encrypt(props.newPassword);
    await this.userRepository.updatePassword({
      ...updatePasswordData,
      props: { ...props, newPassword: hashedPassword },
    });
  };
}
