import { UpdateUserPasswordProps } from "../../../entities";

export type UpdatePasswordPropsValidatorUseCase = {
  validateUpdatePasswordProps: (
    updateUserPasswordProps: Omit<UpdateUserPasswordProps, "id">
  ) => Promise<void>;
};
