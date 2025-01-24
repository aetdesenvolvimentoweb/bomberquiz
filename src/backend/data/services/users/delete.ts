import {
  DeleteUserUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserRepository } from "../../repositories";

interface DeleteUserServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

export class DeleteUserService implements DeleteUserUseCase {
  constructor(private props: DeleteUserServiceProps) {}

  public readonly delete = async (id: string): Promise<void> => {
    const { userRepository, userIdValidator } = this.props;

    await userIdValidator.validateUserId(id);
    await userRepository.delete(id);
  };
}
