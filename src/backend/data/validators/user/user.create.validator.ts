import {
  UserBirthdateValidatorUseCase,
  UserCreateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";
import { MissingParamError } from "@/backend/domain/errors";
import { UserCreateData } from "@/backend/domain/entities";
import { UserUniqueEmailValidator } from "./user.unique.email.validator";

interface UserCreateValidatorProps {
  userBirthdateValidator: UserBirthdateValidatorUseCase;
  userPasswordValidator: UserPasswordValidatorUseCase;
  userEmailValidator: UserEmailValidatorUseCase;
  userPhoneValidator: UserPhoneValidatorUseCase;
  userUniqueEmailValidator: UserUniqueEmailValidator;
}

/**
 * Implementação do validador para criação de usuário
 * @implements {UserCreateValidatorUseCase}
 */
export class UserCreateValidator implements UserCreateValidatorUseCase {
  constructor(private readonly props: UserCreateValidatorProps) {}
  /**
   * Valida os dados para criação de usuário
   * @param data Dados do usuário a serem validados
   * @throws {MissingParamError} Se algum campo obrigatório estiver faltando
   */

  /**
   * Verifica se todos os campos obrigatórios estão presentes
   * @param data Dados do usuário a serem validados
   * @throws {MissingParamError} Se algum campo obrigatório estiver faltando
   */
  private checkMissingParams(data: UserCreateData): void {
    // Mapa de campos para labels
    const fieldToLabelMap: Record<keyof UserCreateData, string> = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      password: "senha",
    };

    // Verifica cada campo obrigatório
    for (const [field, label] of Object.entries(fieldToLabelMap)) {
      if (!data[field as keyof UserCreateData]) {
        throw new MissingParamError(label);
      }
    }
  }

  /**
   * Verifica se os campos têm formatos válidos
   * Delega a validação para validadores específicos de cada tipo de dado
   * @param data Dados do usuário a serem validados
   * @throws {InvalidParamError} Se algum campo tiver formato inválido
   */
  private checkInvalidParams(data: UserCreateData): void {
    const {
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
    } = this.props;

    userBirthdateValidator.validate(data.birthdate);
    userEmailValidator.validate(data.email);
    userPasswordValidator.validate(data.password);
    userPhoneValidator.validate(data.phone);
  }

  /**
   * Verifica se o email já está cadastrado no sistema
   * @param email Email a ser verificado
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado
   */
  private checkDuplicatedResource = async (email: string): Promise<void> => {
    await this.props.userUniqueEmailValidator.validate({ email });
  };

  /**
   * Valida os dados para criação de usuário
   * Executa todas as validações na seguinte ordem:
   * 1. Verifica campos obrigatórios
   * 2. Valida o formato dos campos
   * 3. Verifica se o email é único
   *
   * @param data Dados do usuário a serem validados
   * @throws {MissingParamError} Se algum campo obrigatório estiver faltando
   * @throws {InvalidParamError} Se algum campo for inválido
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado
   */
  public readonly validate = async (data: UserCreateData): Promise<void> => {
    this.checkMissingParams(data);
    this.checkInvalidParams(data);
    await this.checkDuplicatedResource(data.email);
  };
}
