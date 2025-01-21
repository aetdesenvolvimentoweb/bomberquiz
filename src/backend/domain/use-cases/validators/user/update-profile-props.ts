import { UserProfile } from "../../../entities";

export type UpdateProfilePropsValidatorUseCase = {
  validateUpdateProfileProps: (userProfile: UserProfile) => Promise<void>;
};
