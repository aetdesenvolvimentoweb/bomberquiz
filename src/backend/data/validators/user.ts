import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  PhoneValidatorUseCase,
} from "@/backend/domain/use-cases/validators";
import { UserProps, UserRole } from "@/backend/domain/entities";
import {
  duplicatedKeyError,
  invalidParamError,
  missingParamError,
} from "../helpers";
import { UserRepository } from "../repositories";

interface UserValidatorProps {
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
}

export class UserValidator {
  constructor(private props: UserValidatorProps) {}

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
        throw missingParamError(name);
      }
    });
  };

  private checkAlreadyRegisteredEmail = async (
    email: string
  ): Promise<void> => {
    if (await this.props.userRepository.listByEmail(email)) {
      throw duplicatedKeyError({ entity: "usuário", key: "email" });
    }
  };

  private validateEmail = (email: string): void => {
    if (!this.props.emailValidator.isValid(email)) {
      throw invalidParamError("email");
    }
  };

  private validatePhone = (phone: string): void => {
    if (!this.props.phoneValidator.isValid(phone)) {
      throw invalidParamError("telefone");
    }
  };

  private validateBirthdate = (birthdate: Date): void => {
    if (!this.props.dateValidator.isValid(birthdate)) {
      throw invalidParamError("data de nascimento");
    }
  };

  private validateUserRole = (role: UserRole): void => {
    if (!["administrador", "colaborador", "cliente"].includes(role)) {
      throw invalidParamError("função");
    }
  };

  private validatePassword = (password: string, passwordName: string): void => {
    if (password.length < 8) {
      throw invalidParamError(passwordName);
    }
  };

  public readonly validateUserCreation = async (
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
