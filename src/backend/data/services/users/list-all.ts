import { ListAllUsersUseCase } from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface ListAllUsersServiceProps {
  userRepository: UserRepository;
}

export class ListAllUsersService implements ListAllUsersUseCase {
  constructor(private props: ListAllUsersServiceProps) {}

  public readonly listAll = async (): Promise<UserMapped[]> => {
    const { userRepository } = this.props;

    return await userRepository.listAll();
  };
}
