import { UserProfileProps } from "../../../entities";

export type UpdateProfilePropsValidatorUseCase = {
  validateUpdateProfileProps: (props: {
    id: string;
    props: UserProfileProps;
  }) => Promise<void>;
};
