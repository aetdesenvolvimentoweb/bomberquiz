import { CreateUserUseCase } from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";
import { UserValidator } from "../../validators/user";

interface CreateUserServiceProps {
  userRepository: UserRepository;
  userValidator: UserValidator;
}

export class CreateUserService implements CreateUserUseCase {
  constructor(private props: CreateUserServiceProps) {}

  public readonly create = async (userProps: UserProps): Promise<void> => {
    const { userRepository, userValidator } = this.props;

    await userValidator.validateUserCreation(userProps);
    await userRepository.create(userProps);
  };
}
