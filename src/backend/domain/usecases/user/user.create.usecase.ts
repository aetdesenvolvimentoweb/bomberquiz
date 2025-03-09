import { UserCreateData } from "@/backend/domain/entities";

export interface UserCreateUseCase {
  create: (data: UserCreateData) => Promise<void>;
}
