import {
  DeleteUserUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserRepository } from "../../repositories";

interface DeleteUserServiceProps {
  userRepository: UserRepository;
  userValidator: UserIdValidatorUseCase;
}

export class DeleteUserService implements DeleteUserUseCase {
  constructor(private props: DeleteUserServiceProps) {}

  public readonly delete = async (id: string): Promise<void> => {
    const { userRepository, userValidator } = this.props;

    await userValidator.validateUserId(id);
    await userRepository.delete(id);
  };
}
