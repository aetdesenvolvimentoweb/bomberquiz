import { User } from "../../entities";

export interface UserFindByEmailUseCase {
  findByEmail: (email: string) => Promise<User | null>;
}
