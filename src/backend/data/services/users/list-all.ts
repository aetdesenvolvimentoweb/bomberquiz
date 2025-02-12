import { UserFindAllUseCase } from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ConstructorProps {
  userRepository: UserRepository;
}

export class ListAllUsersService implements UserFindAllUseCase {
  constructor(private constructorProps: ConstructorProps) {}

  public readonly findAll = async (): Promise<UserMapped[]> => {
    const { userRepository } = this.constructorProps;

    return await userRepository.findAll();
  };
}
