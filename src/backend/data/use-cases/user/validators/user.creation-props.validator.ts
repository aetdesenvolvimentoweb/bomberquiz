import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  UserCreationPropsValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/data/repository";

interface UserValidatorProps {
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Implementa a validação das propriedades de criação de usuário
 */
export class UserCreationPropsValidator
  implements UserCreationPropsValidatorUseCase
{
  private dateValidator;
  private emailValidator;
  private phoneValidator;
  private userRepository;
  private errorsValidation;

  constructor(private props: UserValidatorProps) {
    this.dateValidator = props.dateValidator;
    this.emailValidator = props.emailValidator;
    this.phoneValidator = props.phoneValidator;
    this.userRepository = props.userRepository;
    this.errorsValidation = props.errorsValidation;
  }

  /**
   * Verifica se as propriedades do usuário estão preenchidas
   * @param userProps Propriedades do usuário a serem verificadas
   * @throws {ErrorApp} Quando alguma propriedade estiver ausente
   */
  private checkMissingUserProps = (userProps: UserProps): void => {
    const fieldNames: { [key in keyof UserProps]: string } = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      role: "função",
      password: "senha",
    };

    Object.entries(fieldNames).forEach(([field, name]) => {
      if (!userProps[field as keyof UserProps]) {
        throw this.errorsValidation.missingParamError(name);
      }
    });
  };

  /**
   * Verifica se o email já está registrado
   * @param email Email a ser verificado
   * @throws {ErrorApp} Quando o email já estiver registrado
   */
  private checkAlreadyRegisteredEmail = async (
    email: string
  ): Promise<void> => {
    if (await this.userRepository.findByEmail(email)) {
      throw this.errorsValidation.duplicatedKeyError({
        entity: "usuário",
        key: "email",
      });
    }
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
   * Valida o formato do telefone
   * @param phone Telefone a ser validado
   * @throws {ErrorApp} Quando o telefone for inválido
   */
  private validatePhone = (phone: string): void => {
    if (!this.phoneValidator.isValid(phone)) {
      throw this.errorsValidation.invalidParamError("telefone");
    }
  };

  /**
   * Valida a data de nascimento
   * @param birthdate Data de nascimento a ser validada
   * @throws {ErrorApp} Quando a data indicar idade menor que 18 anos
   */
  private validateAdultAge = (birthdate: Date): void => {
    if (!this.dateValidator.isAdult(birthdate)) {
      throw this.errorsValidation.invalidParamError("data de nascimento");
    }
  };

  /**
   * Valida o papel do usuário
   * @param role Papel a ser validado
   * @throws {ErrorApp} Quando o papel for inválido
   */
  private validateUserRole = (role: UserRole): void => {
    if (!["administrador", "colaborador", "cliente"].includes(role)) {
      throw this.errorsValidation.invalidParamError("função");
    }
  };

  /**
   * Valida a senha
   * @param password Senha a ser validada
   * @param passwordName Nome do campo de senha para mensagem de erro
   * @throws {ErrorApp} Quando a senha for menor que 8 caracteres
   */
  private validatePassword = (password: string, passwordName: string): void => {
    if (password.length < 8) {
      throw this.errorsValidation.invalidParamError(passwordName);
    }
  };

  /**
   * Valida as propriedades de criação do usuário
   * @param userProps Propriedades do usuário a serem validadas
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  public validateUserCreationProps = async (
    userProps: UserProps
  ): Promise<void> => {
    this.checkMissingUserProps(userProps);
    this.validateEmail(userProps.email);
    await this.checkAlreadyRegisteredEmail(userProps.email);
    this.validatePhone(userProps.phone);
    this.validateAdultAge(userProps.birthdate);
    this.validateUserRole(userProps.role);
    this.validatePassword(userProps.password, "senha");
  };
}
