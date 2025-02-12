import {
  UserFindByIdUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UserFindByIdServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

/**
 * Implementa o serviço de busca de usuário por ID no sistema
 */
export class UserFindByIdService implements UserFindByIdUseCase {
  private userRepository;
  private userIdValidator;

  constructor(private props: UserFindByIdServiceProps) {
    this.userRepository = props.userRepository;
    this.userIdValidator = props.userIdValidator;
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário a ser buscado
   * @returns Promise com dados do usuário mapeado ou null
   * @throws {ErrorApp} Quando a operação falhar
   */
  public findById = async (id: string): Promise<UserMapped | null> => {
    await this.userIdValidator.validateUserId(id);
    return await this.userRepository.findById(id);
  };
}
