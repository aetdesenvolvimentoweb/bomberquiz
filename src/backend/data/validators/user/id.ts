import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserIdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserRepository } from "../../repositories";
import { ValidationErrors } from "../../helpers";

interface UserIdValidatorProps {
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

export class UserIdValidator implements UserIdValidatorUseCase {
  private idValidator;
  private userRepository;
  private validationErrors;

  constructor(private props: UserIdValidatorProps) {
    this.idValidator = props.idValidator;
    this.userRepository = props.userRepository;
    this.validationErrors = props.validationErrors;
  }

  private checkId = async (id: string): Promise<void> => {
    if (!id) {
      throw this.validationErrors.missingParamError("id");
    }

    if (!this.idValidator.isValid(id)) {
      throw this.validationErrors.invalidParamError("id");
    }

    if (!(await this.userRepository.listById(id))) {
      throw this.validationErrors.unregisteredError("id");
    }
  };

  public readonly validateUserId = async (id: string): Promise<void> => {
    await this.checkId(id);
  };
}
