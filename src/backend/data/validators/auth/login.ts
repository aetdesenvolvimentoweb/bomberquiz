import {
  EmailValidatorUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { AuthRepository } from "../../repositories";
import { LoginProps } from "@/backend/domain/entities";
import { ValidationErrors } from "../../helpers";

interface LoginValidatorProps {
  authRepository: AuthRepository;
  emailValidator: EmailValidatorUseCase;
  validationErrors: ValidationErrors;
}

export class LoginValidator implements LoginValidatorUseCase {
  private authRepository: AuthRepository;
  private emailValidator: EmailValidatorUseCase;
  private validationErrors: ValidationErrors;

  constructor(private props: LoginValidatorProps) {
    this.authRepository = props.authRepository;
    this.emailValidator = props.emailValidator;
    this.validationErrors = props.validationErrors;
  }

  private checkMissingLoginProps = (loginProps: LoginProps): void => {
    const fieldNames: { [key in keyof LoginProps]: string } = {
      email: "email",
      password: "senha",
    };

    Object.entries(fieldNames).forEach(([field, name]) => {
      if (!loginProps[field as keyof LoginProps]) {
        throw this.validationErrors.missingParamError(name);
      }
    });
  };

  private validateEmail = (email: string): void => {
    if (!this.emailValidator.isValid(email)) {
      throw this.validationErrors.invalidParamError("email");
    }
  };

  public validateLogin = async (loginProps: LoginProps): Promise<void> => {
    this.checkMissingLoginProps(loginProps);
    this.validateEmail(loginProps.email);
  };
}
