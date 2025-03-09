import { User } from "@/backend/domain/entities";

export interface UserFindByEmailUseCase {
  findByEmail: (email: string) => Promise<User | null>;
}
