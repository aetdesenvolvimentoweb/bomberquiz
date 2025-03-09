import { UserCreateData } from "@/backend/domain/entities";

export interface UserCreateDataValidatorUseCase {
  validate: (data: UserCreateData) => Promise<void>;
}
