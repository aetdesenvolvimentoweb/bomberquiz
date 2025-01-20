import {
  ListUserByIdUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ListUserByIdServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

export class ListUserByIdService implements ListUserByIdUseCase {
  constructor(private props: ListUserByIdServiceProps) {}

  public readonly listById = async (id: string): Promise<UserMapped | null> => {
    const { userRepository, userIdValidator } = this.props;

    await userIdValidator.validateUserId(id);
    return await userRepository.listById(id);
  };
}
