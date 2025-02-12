import {
  AuthLoginPropsValidatorUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { AuthRepository } from "../../../repository";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";

interface LoginValidatorProps {
  authRepository: AuthRepository;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Implementa a validação das propriedades de login no sistema
 */
export class AuthLoginValidator implements AuthLoginPropsValidatorUseCase {
  private authRepository;
  private emailValidator;
  private encrypter;
  private errorsValidation;

  constructor(private props: LoginValidatorProps) {
    this.authRepository = props.authRepository;
    this.emailValidator = props.emailValidator;
    this.encrypter = props.encrypter;
    this.errorsValidation = props.errorsValidation;
  }

  /**
   * Verifica se as propriedades de login estão preenchidas
   * @param loginProps Propriedades de login a serem verificadas
   * @throws {ErrorApp} Quando alguma propriedade estiver ausente
   */
  private checkMissingLoginProps = (loginProps: LoginProps): void => {
    const fieldNames: { [key in keyof LoginProps]: string } = {
      email: "email",
      password: "senha",
    };

    Object.entries(fieldNames).forEach(([field, name]) => {
      if (!loginProps[field as keyof LoginProps]) {
        throw this.errorsValidation.missingParamError(name);
      }
    });
  };

  /**
   * Valida o formato do email
   * @param email Email a ser validado
   * @throws {ErrorApp} Quando o email for inválido
   */
  private validateEmail = (email: string): void => {
    if (!this.emailValidator.isValid(email)) {
      throw this.errorsValidation.invalidParamError("email");
    }
  };

  /**
   * Valida o tamanho da senha
   * @param password Senha a ser validada
   * @throws {ErrorApp} Quando a senha for menor que 8 caracteres
   */
  private validatePassword = (password: string): void => {
    if (password.length < 8) {
      throw this.errorsValidation.invalidParamError("senha");
    }
  };

  /**
   * Verifica se as credenciais correspondem a um usuário válido
   * @param loginProps Propriedades de login a serem verificadas
   * @returns Promise com dados do usuário logado
   * @throws {ErrorApp} Quando as credenciais forem inválidas
   */
  private checkLoginPropsMatch = async (
    loginProps: LoginProps
  ): Promise<UserLogged> => {
    const userLogged = await this.authRepository.authorize(loginProps);

    if (!userLogged) {
      throw this.errorsValidation.unauthorizedError();
    }

    if (
      !(await this.encrypter.verify({
        password: loginProps.password,
        passwordHash: userLogged.password!,
      }))
    ) {
      throw this.errorsValidation.unauthorizedError();
    }

    return {
      id: userLogged.id,
      name: userLogged.name,
      email: userLogged.email,
      role: userLogged.role,
    };
  };

  /**
   * Valida as propriedades de login do usuário
   * @param loginProps Propriedades de login a serem validadas
   * @returns Promise com dados do usuário logado
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  public validateLogin = async (
    loginProps: LoginProps
  ): Promise<UserLogged> => {
    this.checkMissingLoginProps(loginProps);
    this.validateEmail(loginProps.email);
    this.validatePassword(loginProps.password);
    return await this.checkLoginPropsMatch(loginProps);
  };
}
