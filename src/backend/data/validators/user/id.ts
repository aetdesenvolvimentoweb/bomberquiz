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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private checkId = async (id: string): Promise<void> => {};

  public readonly validateUserId = async (id: string): Promise<void> => {
    await this.checkId(id);
  };
}
