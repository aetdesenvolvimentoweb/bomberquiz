import {
  UserIdValidatorUseCase,
  UserUpdateRoleUseCase,
  UserUpdateRoleValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserRepository } from "@/backend/data/repository";
import { UserRole } from "@/backend/domain/entities";

interface UserUpdateRoleServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
  userUpdateRoleValidator: UserUpdateRoleValidatorUseCase;
}

/**
 * Implementa o serviço de atualização de papel de usuário no sistema
 */
export class UserUpdateRoleService implements UserUpdateRoleUseCase {
  private userRepository;
  private userIdValidator;
  private userUpdateRoleValidator;

  constructor(private props: UserUpdateRoleServiceProps) {
    this.userRepository = props.userRepository;
    this.userIdValidator = props.userIdValidator;
    this.userUpdateRoleValidator = props.userUpdateRoleValidator;
  }

  /**
   * Atualiza o papel de um usuário
   * @param updateRoleData Objeto contendo ID do usuário e novo papel
   * @throws {ErrorApp} Quando a operação falhar
   */
  public updateRole = async (updateRoleData: {
    id: string;
    role: UserRole;
  }): Promise<void> => {
    const { id, role } = updateRoleData;

    await this.userIdValidator.validateUserId(id);
    await this.userUpdateRoleValidator.validateUpdateRole(role);
    await this.userRepository.updateRole(updateRoleData);
  };
}
