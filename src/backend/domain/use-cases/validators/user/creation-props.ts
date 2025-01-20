import { UserProps } from "../../../entities";

export type UserCretionPropsValidatorUseCase = {
  validateUserCreationProps: (userProps: UserProps) => Promise<void>;
};
