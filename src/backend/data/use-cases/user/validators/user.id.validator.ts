import {
  IdValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/data/repository";

interface UserIdValidatorProps {
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Implementa a validação de ID de usuário no sistema
 */
export class UserIdValidator implements UserIdValidatorUseCase {
  private idValidator;
  private userRepository;
  private errorsValidation;

  constructor(private props: UserIdValidatorProps) {
    this.idValidator = props.idValidator;
    this.userRepository = props.userRepository;
    this.errorsValidation = props.errorsValidation;
  }

  /**
   * Verifica se o ID é válido e existe no sistema
   * @param id ID do usuário a ser validado
   * @throws {ErrorApp} Quando o ID for inválido ou não existir
   */
  private checkId = async (id: string): Promise<void> => {
    if (!id) {
      throw this.errorsValidation.missingParamError("id");
    }

    if (!this.idValidator.isValid(id)) {
      throw this.errorsValidation.invalidParamError("id");
    }

    if (!(await this.userRepository.findById(id))) {
      throw this.errorsValidation.unregisteredError("id");
    }
  };

  /**
   * Valida o ID de um usuário
   * @param id ID do usuário a ser validado
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  public validateUserId = async (id: string): Promise<void> => {
    await this.checkId(id);
  };
}
