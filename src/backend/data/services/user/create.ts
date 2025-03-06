import { UserCreateData } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateUseCase } from "@/backend/domain/usecases";

interface UserCreateServiceProps {
  userRepository: UserRepository;
}

export class UserCreateService implements UserCreateUseCase {
  constructor(private readonly props: UserCreateServiceProps) {}

  public readonly create = async (data: UserCreateData): Promise<void> => {
    const { userRepository } = this.props;

    await userRepository.create(data);
  };
}
