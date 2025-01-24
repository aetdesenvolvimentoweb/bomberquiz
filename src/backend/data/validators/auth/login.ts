import {
  EmailValidatorUseCase,
  EncrypterUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { AuthRepository } from "../../repositories";
import { ValidationErrors } from "../../helpers";

interface LoginValidatorProps {
  authRepository: AuthRepository;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  validationErrors: ValidationErrors;
}

export class LoginValidator implements LoginValidatorUseCase {
  private authRepository: AuthRepository;
  private emailValidator: EmailValidatorUseCase;
  private encrypter: EncrypterUseCase;
  private validationErrors: ValidationErrors;

  constructor(private props: LoginValidatorProps) {
    this.authRepository = props.authRepository;
    this.emailValidator = props.emailValidator;
    this.encrypter = props.encrypter;
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

  private validatePassword = (password: string): void => {
    if (password.length < 8) {
      throw this.validationErrors.invalidParamError("senha");
    }
  };

  private checkLoginPropsMatch = async (
    loginProps: LoginProps
  ): Promise<UserLogged> => {
    const userLogged = await this.authRepository.authorize(loginProps);

    if (!userLogged) {
      throw this.validationErrors.unauthorizedError();
    }

    if (
      !(await this.encrypter.verify(loginProps.password, userLogged.password!))
    ) {
      throw this.validationErrors.unauthorizedError();
    }

    return {
      id: userLogged.id,
      name: userLogged.name,
      email: userLogged.email,
      role: userLogged.role,
    };
  };

  public validateLogin = async (
    loginProps: LoginProps
  ): Promise<UserLogged> => {
    this.checkMissingLoginProps(loginProps);
    this.validateEmail(loginProps.email);
    this.validatePassword(loginProps.password);
    return await this.checkLoginPropsMatch(loginProps);
  };
}
