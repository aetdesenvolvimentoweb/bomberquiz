import { ListAllUsersUseCase } from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ConstructorProps {
  userRepository: UserRepository;
}

export class ListAllUsersService implements ListAllUsersUseCase {
  constructor(private constructorProps: ConstructorProps) {}

  public readonly listAll = async (): Promise<UserMapped[]> => {
    const { userRepository } = this.constructorProps;

    return await userRepository.listAll();
  };
}
