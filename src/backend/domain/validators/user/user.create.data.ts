import { UserCreateData } from "../../entities";

export interface UserCreateDataValidatorUseCase {
  validate: (data: UserCreateData) => Promise<void>;
}
