import { UserCreateData } from "../../entities";

export interface UserCreateUseCase {
  create: (data: UserCreateData) => Promise<void>;
}
