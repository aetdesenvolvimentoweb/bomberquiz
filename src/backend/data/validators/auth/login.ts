import { AuthRepository } from "../../repositories";
import { LoginProps } from "@/backend/domain/entities";
import { LoginValidatorUseCase } from "@/backend/domain/use-cases";
import { ValidationErrors } from "../../helpers";

interface LoginValidatorProps {
  authRepository: AuthRepository;
  validationErrors: ValidationErrors;
}

export class LoginValidator implements LoginValidatorUseCase {
  private authRepository: AuthRepository;
  private validationErrors: ValidationErrors;

  constructor(private props: LoginValidatorProps) {
    this.authRepository = props.authRepository;
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

  public validateLogin = async (loginProps: LoginProps): Promise<void> => {
    this.checkMissingLoginProps(loginProps);
  };
}
