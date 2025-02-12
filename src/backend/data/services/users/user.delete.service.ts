import {
  UserDeleteUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserRepository } from "@/backend/data/repository";

interface UserDeleteServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

/**
 * Implementa o serviço de remoção de usuário do sistema
 */
export class UserDeleteService implements UserDeleteUseCase {
  private userRepository;
  private userIdValidator;

  constructor(private props: UserDeleteServiceProps) {
    this.userRepository = props.userRepository;
    this.userIdValidator = props.userIdValidator;
  }

  /**
   * Remove um usuário do sistema
   * @param id ID do usuário a ser removido
   * @throws {ErrorApp} Quando a operação falhar
   */
  public delete = async (id: string): Promise<void> => {
    await this.userIdValidator.validateUserId(id);
    await this.userRepository.delete(id);
  };
}
