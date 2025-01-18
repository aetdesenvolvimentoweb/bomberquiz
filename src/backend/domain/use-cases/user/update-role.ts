import { UpdateUserRoleProps } from "../../entities";

export type UpdateUserRoleUseCase = {
  updateRole: (updateUserRoleProps: UpdateUserRoleProps) => Promise<void>;
};
