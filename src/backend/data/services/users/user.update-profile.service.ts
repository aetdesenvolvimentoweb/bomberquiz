import {
  UserIdValidatorUseCase,
  UserUpdateProfilePropsValidatorUseCase,
  UserUpdateProfileUseCase,
} from "@/backend/domain/use-cases";
import { UserProfileProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UserUpdateProfileServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  userUpdateProfilePropsValidator: UserUpdateProfilePropsValidatorUseCase;
}

/**
 * Implementa o serviço de atualização de perfil de usuário no sistema
 */
export class UserUpdateProfileService implements UserUpdateProfileUseCase {
  private userRepository;
  private userIdValidator;
  private userUpdateProfilePropsValidator;

  constructor(private props: UserUpdateProfileServiceProps) {
    this.userRepository = props.userRepository;
    this.userIdValidator = props.userIdValidator;
    this.userUpdateProfilePropsValidator =
      props.userUpdateProfilePropsValidator;
  }

  /**
   * Atualiza o perfil de um usuário
   * @param updateProfileData Objeto contendo ID do usuário e dados do perfil
   * @throws {ErrorApp} Quando a operação falhar
   */
  public updateProfile = async (updateProfileData: {
    id: string;
    props: UserProfileProps;
  }): Promise<void> => {
    const { id } = updateProfileData;

    await this.userIdValidator.validateUserId(id);
    await this.userUpdateProfilePropsValidator.validateUpdateProfileProps(
      updateProfileData
    );
    await this.userRepository.updateProfile(updateProfileData);
  };
}
