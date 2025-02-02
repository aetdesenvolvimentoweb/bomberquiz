import { UserRole } from "../../entities";

export type UpdateUserRoleUseCase = {
  updateRole: (props: { id: string; role: UserRole }) => Promise<void>;
};
