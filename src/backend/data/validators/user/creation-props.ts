import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { UserCreationPropsValidatorUseCase } from "@/backend/domain/use-cases";
import { UserRepository } from "../../repositories";
import { ValidationErrors } from "../../helpers";

interface UserValidatorProps {
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

export class UserCreationPropsValidator
  implements UserCreationPropsValidatorUseCase
{
  private dateValidator;
  private emailValidator;
  private phoneValidator;
  private userRepository;
  private validationErrors;

  constructor(private props: UserValidatorProps) {
    this.dateValidator = props.dateValidator;
    this.emailValidator = props.emailValidator;
    this.phoneValidator = props.phoneValidator;
    this.userRepository = props.userRepository;
    this.validationErrors = props.validationErrors;
  }

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
        throw this.validationErrors.missingParamError(name);
      }
    });
  };

  private checkAlreadyRegisteredEmail = async (
    email: string
  ): Promise<void> => {
    if (await this.userRepository.findByEmail(email)) {
      throw this.validationErrors.duplicatedKeyError({
        entity: "usuário",
        key: "email",
      });
    }
  };

  private validateEmail = (email: string): void => {
    if (!this.emailValidator.isValid(email)) {
      throw this.validationErrors.invalidParamError("email");
    }
  };

  private validatePhone = (phone: string): void => {
    if (!this.phoneValidator.isValid(phone)) {
      throw this.validationErrors.invalidParamError("telefone");
    }
  };

  private validateBirthdate = (birthdate: Date): void => {
    if (!this.dateValidator.isAdult(birthdate)) {
      throw this.validationErrors.invalidParamError("data de nascimento");
    }
  };

  private validateUserRole = (role: UserRole): void => {
    if (!["administrador", "colaborador", "cliente"].includes(role)) {
      throw this.validationErrors.invalidParamError("função");
    }
  };

  private validatePassword = (password: string, passwordName: string): void => {
    if (password.length < 8) {
      throw this.validationErrors.invalidParamError(passwordName);
    }
  };

  public readonly validateUserCreationProps = async (
    userProps: UserProps
  ): Promise<void> => {
    this.checkMissingUserProps(userProps);
    this.validateEmail(userProps.email);
    await this.checkAlreadyRegisteredEmail(userProps.email);
    this.validatePhone(userProps.phone);
    this.validateBirthdate(userProps.birthdate);
    this.validateUserRole(userProps.role);
    this.validatePassword(userProps.password, "senha");
  };
}
