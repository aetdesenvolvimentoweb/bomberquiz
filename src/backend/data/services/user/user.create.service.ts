import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserCreateValidatorUseCase } from "@/backend/domain/validators";
import { UserRepository } from "@/backend/domain/repositories/user.repository";

interface UserCreateServiceProps {
  repository: UserRepository;
  sanitizer: UserCreateDataSanitizerUseCase;
  validator: UserCreateValidatorUseCase;
}

export class UserCreateService implements UserCreateUseCase {
  constructor(private readonly props: UserCreateServiceProps) {}

  public readonly create = async (data: UserCreateData): Promise<void> => {
    const { repository } = this.props;

    await repository.create(data);
  };
}
