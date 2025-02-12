import {
  UserIdValidatorUseCase,
  UserUpdateProfilePropsValidatorUseCase,
  UserUpdateProfileUseCase,
} from "@/backend/domain/use-cases";
import { UserProfileProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface constructorProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updateProfilePropsValidator: UserUpdateProfilePropsValidatorUseCase;
}

export class UpdateUserProfileService implements UserUpdateProfileUseCase {
  constructor(private constructorProps: constructorProps) {}

  public readonly updateProfile = async (updateProfileProps: {
    id: string;
    props: UserProfileProps;
  }): Promise<void> => {
    const { updateProfilePropsValidator, userRepository, userIdValidator } =
      this.constructorProps;

    await userIdValidator.validateUserId(updateProfileProps.id);
    await updateProfilePropsValidator.validateUpdateProfileProps(
      updateProfileProps
    );
    await userRepository.updateProfile(updateProfileProps);
  };
}
