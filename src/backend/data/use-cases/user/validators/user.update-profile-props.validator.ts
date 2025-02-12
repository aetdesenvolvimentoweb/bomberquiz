import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  UserPhoneValidatorUseCase,
  UserUpdateProfilePropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserProfileProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UpdateProfileValidatorProps {
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Implementa a validação das propriedades de atualização de perfil no sistema
 */
export class UserUpdateProfilePropsValidator
  implements UserUpdateProfilePropsValidatorUseCase
{
  private dateValidator;
  private emailValidator;
  private phoneValidator;
  private userRepository;
  private errorsValidation;

  constructor(private props: UpdateProfileValidatorProps) {
    this.dateValidator = props.dateValidator;
    this.emailValidator = props.emailValidator;
    this.phoneValidator = props.phoneValidator;
    this.userRepository = props.userRepository;
    this.errorsValidation = props.errorsValidation;
  }

  /**
   * Verifica se as propriedades do perfil estão preenchidas
   * @param userProfileProps Propriedades do perfil a serem verificadas
   * @throws {ErrorApp} Quando alguma propriedade estiver ausente
   */
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
        throw this.errorsValidation.missingParamError(name);
      }
    });
  };

  /**
   * Verifica se o email já está registrado para outro usuário
   * @param id ID do usuário atual
   * @param email Email a ser verificado
   * @throws {ErrorApp} Quando o email já estiver registrado para outro usuário
   */
  private checkAlreadyRegisteredEmail = async (
    id: string,
    email: string
  ): Promise<void> => {
    const user = await this.userRepository.findByEmail(email);
    if (user && user.id !== id && user.email === email) {
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
   * Valida as propriedades de atualização do perfil
   * @param updateProfileData Objeto contendo ID do usuário e dados do perfil
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  public validateUpdateProfileProps = async (updateProfileData: {
    id: string;
    props: UserProfileProps;
  }): Promise<void> => {
    const { id, props } = updateProfileData;

    this.checkMissingUpdateProfileProps(props);
    this.validateEmail(props.email);
    await this.checkAlreadyRegisteredEmail(id, props.email);
    this.validatePhone(props.phone);
    this.validateAdultAge(props.birthdate);
  };
}
