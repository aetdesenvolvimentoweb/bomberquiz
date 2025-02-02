import {
  DeleteUserUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserRepository } from "../../repositories";

interface ConstructorProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

export class DeleteUserService implements DeleteUserUseCase {
  constructor(private constructorProps: ConstructorProps) {}

  public readonly delete = async (id: string): Promise<void> => {
    const { userRepository, userIdValidator } = this.constructorProps;

    await userIdValidator.validateUserId(id);
    await userRepository.delete(id);
  };
}
