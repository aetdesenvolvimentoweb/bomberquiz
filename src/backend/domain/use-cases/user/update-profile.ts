import { UserProfileProps } from "../../entities";

export type UpdateUserProfileUseCase = {
  updateProfile: (props: {
    id: string;
    props: UserProfileProps;
  }) => Promise<void>;
};
