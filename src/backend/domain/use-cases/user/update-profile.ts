import { UserProfile } from "../../entities";

export type UpdateUserProfileUseCase = {
  updateProfile: (userProfile: UserProfile) => Promise<void>;
};
