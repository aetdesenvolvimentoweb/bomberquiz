import { User } from "../../entities";

export type ListUserByEmailUseCase = {
  listByEmail: (email: string) => Promise<User | null>;
};
