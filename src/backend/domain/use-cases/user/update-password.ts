import { UpdateUserPasswordProps } from "../../entities";

export type UpdateUserPasswordUseCase = {
  updatePassword: (
    updateUserPasswordProps: UpdateUserPasswordProps
  ) => Promise<void>;
};
