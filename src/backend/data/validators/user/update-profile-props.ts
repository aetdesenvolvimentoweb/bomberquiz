import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  PhoneValidatorUseCase,
  UpdateProfilePropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProfile, UserProfileProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";
import { ValidationErrors } from "../../helpers";

interface UpdateProfilePropsValidatorDependencies {
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

export class UpdateProfilePropsValidator
  implements UpdateProfilePropsValidatorUseCase
{
  private dateValidator;
  private emailValidator;
  private phoneValidator;
  private userRepository;
  private validationErrors;

  constructor(private props: UpdateProfilePropsValidatorDependencies) {
    this.dateValidator = props.dateValidator;
    this.emailValidator = props.emailValidator;
    this.phoneValidator = props.phoneValidator;
    this.userRepository = props.userRepository;
    this.validationErrors = props.validationErrors;
  }

  private checkMissingUpdateProfileProps = (
    userProfileProps: UserProfileProps
  ): void => {
    const fieldNames: {
      [key in keyof UserProfileProps]: string;
    } = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
    };

    Object.entries(fieldNames).forEach(([field, name]) => {
      if (!userProfileProps[field as keyof UserProfileProps]) {
        throw this.validationErrors.missingParamError(name);
      }
    });
  };

  private checkAlreadyRegisteredEmail = async (
    id: string,
    email: string
  ): Promise<void> => {
    const user = await this.userRepository.listByEmail(email);
    if (user && user.id !== id && user.email === email) {
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
    if (!this.dateValidator.isValid(birthdate)) {
      throw this.validationErrors.invalidParamError("data de nascimento");
    }
  };

  public readonly validateUpdateProfileProps = async (
    userProfile: UserProfile
  ): Promise<void> => {
    this.checkMissingUpdateProfileProps({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      birthdate: userProfile.birthdate,
    });
    this.validateEmail(userProfile.email);
    await this.checkAlreadyRegisteredEmail(userProfile.id, userProfile.email);
    this.validatePhone(userProfile.phone);
    this.validateBirthdate(userProfile.birthdate);
  };
}