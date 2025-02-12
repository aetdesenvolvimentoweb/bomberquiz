import {
  UserFindByIdUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ConstructorProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

export class ListUserByIdService implements UserFindByIdUseCase {
  constructor(private constructorProps: ConstructorProps) {}

  public readonly findById = async (id: string): Promise<UserMapped | null> => {
    const { userRepository, userIdValidator } = this.constructorProps;

    await userIdValidator.validateUserId(id);
    return await userRepository.findById(id);
  };
}
