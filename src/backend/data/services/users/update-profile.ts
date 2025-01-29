import {
  UpdateProfilePropsValidatorUseCase,
  UpdateUserProfileUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProfile } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface UpdateUserProfileServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  updateProfilePropsValidator: UpdateProfilePropsValidatorUseCase;
}

export class UpdateUserProfileService implements UpdateUserProfileUseCase {
  constructor(private props: UpdateUserProfileServiceProps) {}

  public readonly updateProfile = async (props: UserProfile): Promise<void> => {
    const { updateProfilePropsValidator, userRepository, userIdValidator } =
      this.props;

    await userIdValidator.validateUserId(props.id);
    await updateProfilePropsValidator.validateUpdateProfileProps(props);
    await userRepository.updateProfile(props);
  };
}
