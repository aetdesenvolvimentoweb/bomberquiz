import { UserFindAllUseCase } from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UserFindAllServiceProps {
  userRepository: UserRepository;
}

/**
 * Implementa o serviço de listagem de usuários do sistema
 */
export class UserFindAllService implements UserFindAllUseCase {
  private userRepository;

  constructor(private props: UserFindAllServiceProps) {
    this.userRepository = props.userRepository;
  }

  /**
   * Lista todos os usuários cadastrados no sistema
   * @returns Promise com array de usuários mapeados
   * @throws {ErrorApp} Quando a operação falhar
   */
  public findAll = async (): Promise<UserMapped[]> => {
    return await this.userRepository.findAll();
  };
}
