import { UserMapped } from "../../entities";

export type ListUserByIdUseCase = {
  listById: (id: string) => Promise<UserMapped | null>;
};
