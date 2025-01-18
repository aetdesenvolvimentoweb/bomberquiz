import { UserMapped } from "../../entities";

export type ListAllUsersUseCase = {
  listAll: () => Promise<UserMapped[]>;
};
