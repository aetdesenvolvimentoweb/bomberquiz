import { UpdateUserPasswordProps } from "../../../entities";

export type UpdatePasswordPropsValidatorUseCase = {
  validateUpdatePasswordProps: (
    updateUserPasswordProps: UpdateUserPasswordProps
  ) => Promise<void>;
};
